// Import Express framework
const express = require('express');  

// Create an Express app instance
const app = express();  

// Set the port and host for the server
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces so the server is accessible externally

// Import MongoClient to interact with MongoDB
const { MongoClient } = require("mongodb");  

// Import body-parser to parse POST request data
const bodyParser = require("body-parser"); // to parse POST data

// Middleware to parse JSON requests (important for POST/PUT)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Additional middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI (local MongoDB)
const uri = "mongodb://localhost:27017"; 

// Create a new MongoClient instance with options
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Async function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect(); // connect to MongoDB server
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err); // log any connection errors
  }
}

// Call the connect function immediately
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

// Example API route (optional)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' }); // simple JSON response
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
