import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

declare global {
  // preserve across hot reloads in dev
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

function createClient() {
  console.log("\x1b[33m[mongodb] Connecting to MongoDB...\x1b[0m");
  return new MongoClient(uri).connect().then((client) => {
    console.log("\x1b[32m[mongodb] ✓ Connected to MongoDB\x1b[0m");
    return client;
  }).catch((err) => {
    console.error("\x1b[31m[mongodb] ✗ Failed to connect to MongoDB:", err.message, "\x1b[0m");
    throw err;
  });
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClient();
}

export default clientPromise;
