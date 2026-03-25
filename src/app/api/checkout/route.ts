import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  PAYMONGO_BASE,
  paymongoAuth,
  PACKS,
  type PackId,
} from "@/lib/paymongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const packId = body.packId as string;

  if (!packId || !(packId in PACKS)) {
    return Response.json({ error: "Invalid pack." }, { status: 400 });
  }

  const pack = PACKS[packId as PackId];

  const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: paymongoAuth(process.env.PAYMONGO_SECRET_KEY!),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              currency: "PHP",
              amount: pack.amount * 100, // convert PHP to centavos for PayMongo
              name: pack.label,
              description: pack.description,
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya"],
          success_url: `${process.env.NEXTAUTH_URL}/upgrade/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/upgrade`,
          metadata: {
            userId: session.user.id,
            packId,
          },
        },
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[paymongo checkout]", JSON.stringify(data));
    return Response.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }

  const checkoutUrl = data.data?.attributes?.checkout_url;
  return Response.json({ url: checkoutUrl });
}
