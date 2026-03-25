import crypto from "crypto";
import { PACKS, type PackId } from "@/lib/paymongo";
import { connectMongoose } from "@/lib/mongoose";
import User from "@/lib/models/User";
import Purchase from "@/lib/models/Purchase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Verifies the PayMongo webhook signature.
 * Header format: t=<timestamp>,te=<test_sig>,li=<live_sig>
 * Signed payload: <timestamp>.<raw_body>
 */
function verifySignature(
  payload: string,
  header: string,
  secret: string,
): boolean {
  const parts: Record<string, string> = {};
  header.split(",").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx !== -1) parts[part.slice(0, idx)] = part.slice(idx + 1);
  });

  const timestamp = parts["t"];
  const signature = parts["te"] ?? parts["li"]; // te = test, li = live

  if (!timestamp || !signature) return false;

  const signed = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signed)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex"),
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("paymongo-signature");

  if (!sig) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  try {
    if (!verifySignature(body, sig, process.env.PAYMONGO_WEBHOOK_SECRET!)) {
      return Response.json({ error: "Invalid signature." }, { status: 400 });
    }
  } catch {
    return Response.json(
      { error: "Signature verification failed." },
      { status: 400 },
    );
  }

  const event = JSON.parse(body);
  const eventType = event.data?.attributes?.type;

  if (eventType === "checkout_session.payment.paid") {
    const checkoutSession = event.data?.attributes?.data;
    // PayMongo puts metadata on the payment object, not the checkout session
    const metadata =
      checkoutSession?.attributes?.metadata ??
      checkoutSession?.attributes?.payments?.[0]?.attributes?.metadata ??
      checkoutSession?.attributes?.payment_intent?.attributes?.metadata;
    const { userId, packId } = metadata ?? {};

    if (!userId || !packId || !(packId in PACKS)) {
      console.error(
        "[paymongo webhook] Missing or invalid metadata:",
        metadata,
      );
      return Response.json({ error: "Invalid metadata." }, { status: 400 });
    }

    const pack = PACKS[packId as PackId];
    const { credits } = pack;
    const checkout_session_id = checkoutSession?.id as string | undefined;
    const payment_id = checkoutSession?.attributes?.payments?.[0]?.id as
      | string
      | undefined;

    try {
      await connectMongoose();
      await Promise.all([
        User.findByIdAndUpdate(userId, { $inc: { credits } }),
        Purchase.create({
          user_id: userId,
          pack_id: packId,
          credits,
          amount: pack.amount,
          currency: "PHP",
          checkout_session_id,
          payment_id,
          status: "paid",
        }),
      ]);
      console.log(
        `\x1b[32m[paymongo webhook] Added ${credits} credits to user ${userId}\x1b[0m`,
      );
    } catch (err) {
      console.error("[paymongo webhook] Failed to update credits:", err);
      return Response.json(
        { error: "Database update failed." },
        { status: 500 },
      );
    }
  }

  return Response.json({ received: true });
}
