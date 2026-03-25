import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      credits: number;
      plan: "free" | "pro";
    } & DefaultSession["user"];
  }
  interface User {
    credits?: number;
    plan?: "free" | "pro";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    credits?: number;
    plan?: "free" | "pro";
  }
}
