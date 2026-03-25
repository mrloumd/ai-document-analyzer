import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tokens: number;
      plan: "free" | "pro";
    } & DefaultSession["user"];
  }
  interface User {
    tokens?: number;
    plan?: "free" | "pro";
  }
}
