import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import type { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "./mongodb";

function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

function userFromDoc(
  doc: Record<string, unknown>,
): AdapterUser & { credits: number; plan: "free" | "paid" | "unpaid" } {
  return {
    id: (doc._id as ObjectId).toString(),
    name: (doc.name as string) ?? null,
    email: doc.email as string,
    emailVerified: (doc.email_verified as Date) ?? null,
    image: (doc.image as string) ?? null,
    credits: (doc.credits as number) ?? 0,
    plan: (doc.plan as "free" | "paid" | "unpaid") ?? "free",
  };
}

export function CustomMongoDBAdapter(
  clientPromise: Promise<MongoClient>,
): Adapter {
  const cols = async () => {
    const db = (await clientPromise).db(DB_NAME);
    return {
      users: db.collection("users"),
      accounts: db.collection("accounts"),
      verificationTokens: db.collection("verification_tokens"),
    };
  };

  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const { users } = await cols();
      const now = new Date();
      const doc = {
        name: user.name ?? null,
        email: user.email,
        email_verified: user.emailVerified ?? null,
        image: user.image ?? null,
        credits: 3,
        plan: "free",
        created_at: now,
        updated_at: now,
      };
      const { insertedId } = await users.insertOne(doc);
      return userFromDoc({ _id: insertedId, ...doc });
    },

    async getUser(id) {
      const { users } = await cols();
      const doc = await users.findOne({ _id: toObjectId(id) });
      return doc ? userFromDoc(doc as Record<string, unknown>) : null;
    },

    async getUserByEmail(email) {
      const { users } = await cols();
      const doc = await users.findOne({ email });
      return doc ? userFromDoc(doc as Record<string, unknown>) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { users, accounts } = await cols();
      const account = await accounts.findOne({
        provider,
        provider_account_id: providerAccountId,
      });
      if (!account) return null;
      const doc = await users.findOne({ _id: account.user_id });
      return doc ? userFromDoc(doc as Record<string, unknown>) : null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { users } = await cols();
      const update: Record<string, unknown> = { updated_at: new Date() };
      if (user.name !== undefined) update.name = user.name;
      if (user.email !== undefined) update.email = user.email;
      if ("emailVerified" in user) update.email_verified = user.emailVerified;
      if (user.image !== undefined) update.image = user.image;
      const doc = await users.findOneAndUpdate(
        { _id: toObjectId(user.id) },
        { $set: update },
        { returnDocument: "after" },
      );
      return userFromDoc(doc as unknown as Record<string, unknown>);
    },

    async deleteUser(userId) {
      const { users, accounts } = await cols();
      const id = toObjectId(userId);
      await Promise.all([
        users.deleteOne({ _id: id }),
        accounts.deleteMany({ user_id: id }),
      ]);
    },

    async linkAccount(account: AdapterAccount) {
      const { accounts } = await cols();
      const now = new Date();
      await accounts.insertOne({
        user_id: toObjectId(account.userId),
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        type: account.type,
        created_at: now,
        updated_at: now,
      });
      return account;
    },

    async unlinkAccount({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const { accounts } = await cols();
      await accounts.deleteOne({
        provider,
        provider_account_id: providerAccountId,
      });
    },

    // JWT strategy — sessions not stored in DB
    async createSession(s: AdapterSession) {
      return s;
    },
    async getSessionAndUser() {
      return null;
    },
    async updateSession(
      _s: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      return null;
    },
    async deleteSession() {},

    async createVerificationToken(token: VerificationToken) {
      const { verificationTokens } = await cols();
      await verificationTokens.insertOne({ ...token });
      return token;
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }) {
      const { verificationTokens } = await cols();
      const doc = await verificationTokens.findOneAndDelete({
        identifier,
        token,
      });
      return doc ? (doc as unknown as VerificationToken) : null;
    },
  };
}
