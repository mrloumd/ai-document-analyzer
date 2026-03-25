import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { connectMongoose } from "./mongoose";
import User from "./models/User";

type AuthedHandler = (req: Request, userId: string) => Promise<Response>;

/**
 * Wraps a route handler with:
 * 1. Session check (401 if not signed in)
 * 2. Token check (402 if tokens <= 0)
 * 3. Token deduction on 2xx response
 */
export function withAuth(handler: AuthedHandler) {
  return async (req: Request): Promise<Response> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { error: "Authentication required.", code: "UNAUTHENTICATED" },
        { status: 401 },
      );
    }

    await connectMongoose();
    const user = await User.findById(session.user.id).select("tokens");

    if (!user || user.tokens <= 0) {
      return Response.json(
        { error: "No tokens remaining. Upgrade to continue.", code: "NO_TOKENS" },
        { status: 402 },
      );
    }

    const response = await handler(req, session.user.id);

    if (response.status >= 200 && response.status < 300) {
      await User.findByIdAndUpdate(session.user.id, { $inc: { tokens: -1 } });
    }

    return response;
  };
}
