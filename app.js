const express = require('express');
const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces
const { MongoClient } = require("mongodb");


// Middleware to parse JSON (important if you want POST requests)
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static('public'));

// MongoDB URI from Atlas
const uri = "mongodb+srv://marcelo:<Otsm0170!>@abyssdatabase1.v75lqi6.mongodb.net/?retryWrites=true&w=majority&appName=AbyssDatabase1";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to Mongo
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB error:", err);
  }
}

connectDB();

// Example API route
app.get("/api/message", async (req, res) => {
  try {
    const db = client.db("test"); // change to your db name
    const collection = db.collection("messages");
    const message = await collection.findOne({});
    res.json(message);
  } catch (err) {
    res.status(500).send("Error fetching message");
  }
});

// Example API route (optional)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});