import { MongoClient } from "mongodb";

// MongoDB connection string (in a real app, this would be in an environment variable)
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener";

// MongoDB client
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new connection
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
