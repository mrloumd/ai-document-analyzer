import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import clientPromise from "./mongodb";
import { connectMongoose } from "./mongoose";
import User from "./models/User";
import { CustomMongoDBAdapter } from "./db-adapter";

export const authOptions: NextAuthOptions = {
  adapter: CustomMongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Initial sign-in: populate from user object
        token.id = user.id;
        token.credits = (user as { credits?: number }).credits ?? 0;
        token.plan = (user as { plan?: "free" | "paid" | "unpaid" }).plan ?? "free";
        return token;
      }
      // Every JWT refresh (including update() calls): re-fetch fresh data from DB
      if (token.id) {
        await connectMongoose();
        const dbUser = (await User.findById(token.id).lean()) as {
          credits?: number;
          plan?: "free" | "paid" | "unpaid";
        } | null;
        if (!dbUser) {
          // User deleted from DB — invalidate the session
          return null as unknown as JWT;
        }
        token.credits = dbUser.credits ?? 0;
        token.plan = dbUser.plan ?? "free";
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id ?? "";
      session.user.credits = token.credits ?? 0;
      session.user.plan = token.plan ?? "free";
      return session;
    },
  },
};
