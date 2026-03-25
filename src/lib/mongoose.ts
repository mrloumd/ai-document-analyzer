import mongoose from "mongoose";
import { DB_NAME } from "./mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectMongoose() {
  if (mongoose.connection.readyState >= 1) return;
  if (global._mongooseConn) return global._mongooseConn;

  console.log("\x1b[33m[mongoose] Connecting to MongoDB...\x1b[0m");
  global._mongooseConn = mongoose
    .connect(process.env.MONGODB_URI!, { dbName: DB_NAME })
    .then((m) => {
      console.log("\x1b[32m[mongoose] ✓ Connected to MongoDB\x1b[0m");
      return m;
    })
    .catch((err) => {
      console.error(
        "\x1b[31m[mongoose] ✗ Failed to connect to MongoDB:",
        err.message,
        "\x1b[0m",
      );
      throw err;
    });
  return global._mongooseConn;
}
