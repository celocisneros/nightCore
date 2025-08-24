// Import MongoClient
const { MongoClient } = require("mongodb");

// MongoDB connection URI (local)
const uri = "mongodb://localhost:27017";

// Create MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Async function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// Export the client and connectDB function
module.exports = { client, connectDB };
