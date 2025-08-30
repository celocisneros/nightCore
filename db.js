// Import MongoClient
const { MongoClient } = require("mongodb");

// MongoDB connection URI (local)
const uri = "mongodb://localhost:27017";

// Create MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let playersCollection; //we will use this to talk to the collection

// Async function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("nightcore"); // Pick database
    playersCollection = db.collection("players"); // Pick collection
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Export the client and connectDB function
module.exports = { connectDB,
  getPlayersCollection: () => playersCollection
 };
