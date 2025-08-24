const express = require('express');
const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces

// Middleware to parse JSON (important if you want POST requests)
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static('public'));

//import mongodb database
import { MongoClient } from "mongodb";
const uri = "mongodb+srv://marcelo:<Otsm0170!>@abyssdatabase1.v75lqi6.mongodb.net/?retryWrites=true&w=majority&appName=AbyssDatabase1";
const client = new MongoClient(uri);

//mongodb test route
app.get("/api/message", async (req, res) => {
  try {
    await client.connect(); //connect if not already
    const db = client.db("testdb");
    const coll = db.collection("messages");

    //grab the first message
    const msg = await coll.findOne();
    res.send(msg?.text || "No message found");
  } catch (err) {
    res.status(500).send("DB error: " + err);
  }
});

// Example API route (optional)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});