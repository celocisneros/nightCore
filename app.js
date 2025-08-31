// Import Express framework
const express = require('express'); 

// Import MongoDB client and connect function from db.js
const { client, connectDB, getPlayersCollection } = require("./db"); // << here

// Create an Express app instance
const app = express();  

// Set the port and host for the server
const PORT = 3000;
const HOST = '0.0.0.0'; // listen on all network interfaces so the server is accessible externally

// Import body-parser to parse POST request data
const bodyParser = require("body-parser"); // to parse POST data

// Middleware to parse JSON requests (important for POST/PUT)
app.use(express.json());

//we import sessions
const session = require("express-session");

app.use(session({
  secret: "your-secret-key", // change to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24*60*60*1000 } // 1 day in milliseconds
}));

// Serve static files from the "public" folder
app.use(express.static('public'));

app.use(express.json({ limit: "5mb" })); // allow JSON body up to 5MB

// Additional middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// --- REGISTER ROUTE ---
// This route will handle creating a new player in the MongoDB "players" collection
app.post("/api/register", async (req, res) => {
  try {
    // 1. Get the players collection from db.js
    //    (db.js connected earlier and stored this reference for us)
    const playersCollection = getPlayersCollection();

    // 2. Pull out the data the user sent from the frontend (register.html)
    //    The frontend sends: { username, password, email }
    const { username, password, email } = req.body;

    // 3. Basic validation check: make sure all fields are provided
    //    If any are missing, return a 400 (bad request) error
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 4. Check if a player with the same username already exists in the database
    //    findOne() searches the "players" collection for a matching username
    const existing = await playersCollection.findOne({ username });

    // 5. If a player with that username already exists, we stop here
    //    Return a 400 error with a helpful message
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // 6. Build a new player object that we want to insert into MongoDB
    //    - Store username, password (⚠️ plain text for now, hash later)
    //    - Email
    //    - Date account was created
    //    - Some default stats for your game (hp, attack, defense)
    const newPlayer = {
      username,
      password,
      email,
      createdAt: new Date(),
      stats: {
        hp: 100,
        attack: 10,
        defense: 5
      }
    };

    // 7. Insert this new player document into the "players" collection
    await playersCollection.insertOne(newPlayer);

    // 8. Send back a success response to the frontend
    //    The frontend will display this message under the form
    res.json({ message: "Player registered successfully!" });
  } catch (err) {
    // 9. If anything goes wrong (like database connection issues),
    //    log the error and send a 500 (internal server error) response
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

});

// --- LOGIN ROUTE ---
// This route will check if the username/password match a player in MongoDB
app.post("/api/login", async (req, res) => {
  try {
    // 1. Get the players collection from db.js
    const playersCollection = getPlayersCollection();

    // 2. Extract the username and password sent from the frontend
    const { username, password } = req.body;

    // 3. Basic validation: make sure both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 4. Search MongoDB for a player with the given username
    const player = await playersCollection.findOne({ username });

    // 5. If no player found, return an error
    if (!player) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // 6. Check if the password matches (⚠️ plain text for now)
    if (player.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // 7. Remove the password before saving to session
    const { password: _, ...safePlayer } = player;

    // 8. Store full player object (without password) in session
    req.session.player = safePlayer;

    // 9. Send success response
    res.json({ message: "Login successful!", player: safePlayer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/current-user", (req, res) => {
  if (req.session && req.session.player) {
    res.json({ player: req.session.player });  // already full player object
  } else {
    res.json({ player: null });
  }
});

//SAVE PROFILE PIC TO DB
app.post("/api/update-profile-pic", async (req, res) => {
  try {
    // Step 2a: Make sure the player is logged in
    if (!req.session || !req.session.player) {
      return res.status(401).json({ error: "Not logged in" });
    }

    // Step 2b: Grab the player ID and the uploaded image
    const playerId = req.session.player._id;
    const base64Image = req.body.profilePic;

    if (!base64Image) {
      return res.status(400).json({ error: "No profilePic in body" });
    }

    // Step 2c: Connect to the MongoDB collection
    const db = client.db("yourDbName");       // replace with your DB name
    const players = db.collection("players"); // replace with your collection name

    // Step 2d: Update the profilePic field for the logged-in player
    const result = await players.updateOne(
      { _id: playerId },
      { $set: { profilePic: base64Image } }
    );

    // Step 2e: Update the session copy
    req.session.player.profilePic = base64Image;

    res.json({ success: true, profilePic: base64Image });

  } catch (err) {
    console.error("Error updating profile pic:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});





// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
