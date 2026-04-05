// Database code goes here

const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydatabase";

const client = new MongoClient(url);

async function connect() {
  await client.connect();
  console.log("Connected to database");
  const db = client.db(dbName);
  // Perform database operations
}

connect().catch(console.error);
