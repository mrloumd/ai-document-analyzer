import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import clientPromise from "./mongodb";
import { connectMongoose } from "./mongoose";
import User from "./models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/auth/signin" },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      session.user.tokens = (user as { tokens?: number }).tokens ?? 0;
      session.user.plan = (user as { plan?: "free" | "pro" }).plan ?? "free";
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        await connectMongoose();
        await User.findByIdAndUpdate(user.id, {
          $set: { tokens: 1, plan: "free" },
        });
      } catch (err) {
        console.error("[auth] createUser event error:", err);
      }
    },
  },
};
