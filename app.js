// Import Express framework
const express = require('express'); 

// Import MongoDB client and connect function from db.js
const { client, connectDB } = require("./db"); // << here

// Create an Express app instance
const app = express();  

// Set the port and host for the server
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces so the server is accessible externally

// Import body-parser to parse POST request data
const bodyParser = require("body-parser"); // to parse POST data

// Middleware to parse JSON requests (important for POST/PUT)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Additional middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Route: grab a message from the local MongoDB "testdb" database in "messages" collection
app.get("/api/message", async (req, res) => {
  try {
    const db = client.db("testdb"); // select database
    const collection = db.collection("messages"); // select collection
    const message = await collection.findOne({}); // fetch one document
    res.json(message); // send document as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching message"); // send error if fails
  }
});

//Route: grab the users in the users collection in the nightCore database
app.get("/api/displayUsers", async (req, res) => {
  try{
    const db = client.db("nightcore");
    const collection = db.collection("users");
    const user = await collection.findOne({});
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
