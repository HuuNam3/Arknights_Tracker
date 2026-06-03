import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _arkreviewMongoClientPromise: Promise<MongoClient> | undefined;
}

export const mongoClientPromise =
  global._arkreviewMongoClientPromise ??
  (global._arkreviewMongoClientPromise = new MongoClient(uri, options).connect());

export const mongoDbName = process.env.MONGODB_DB ?? "Arknights";
