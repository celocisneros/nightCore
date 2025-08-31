// Import Express framework
const express = require('express'); 
const bodyParser = require("body-parser");
const session = require("express-session");
const { client, connectDB, getPlayersCollection } = require("./db"); // << here

// Import and mount routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/player", require("./routes/playerRoutes"));
// later: app.use("/api/battle", require("./routes/battleRoutes"));

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

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
