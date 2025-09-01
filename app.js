// Import Express framework
const express = require('express'); 
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require('path');
const { client, connectDB, getPlayersCollection } = require("./db"); // << here

// Create an Express app
const app = express();  
const PORT = 3000;
const HOST = '0.0.0.0'; 

//json middleware
app.use(express.json());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

//sessions
app.use(session({
  secret: "your-secret-key", // change to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24*60*60*1000 } // 1 day in milliseconds
}));

//serve public and uploads folder
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

//import routes
const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

//use routes
app.use("/api", authRoutes);
app.use("/api", playerRoutes);

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
