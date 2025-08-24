const express = require('express');
const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser"); // to parse POST data


// Middleware to parse JSON (important if you want POST requests)
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static('public'));

// For local MongoDB
const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//grab message from local mongo testdb database in messages collection
app.get("/api/message", async (req, res) => {
  try {
    const db = client.db("testdb");
    const collection = db.collection("messages");
    const message = await collection.findOne({});
    res.json(message);
  } catch (err) {
    console.error(err);
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