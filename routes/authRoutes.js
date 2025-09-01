const express = require("express");
const router = express.Router();
const { client, connectDB, getPlayersCollection } = require("../db");


// --- REGISTER ROUTE ---
// This route will handle creating a new player in the MongoDB "players" collection
router.post("/register", async (req, res) => {
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
      hp: 100,
      xp: 0,
      yen: 0,
      attack: 10,
      defense: 10,
      profilePicPath: '',
      level: 1
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
router.post("/login", async (req, res) => {
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

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // clears session cookie
    res.json({ message: "Logged out successfully" });
  });
});

// --- DELETE PLAYER ROUTE ---
router.delete("/player-delete", async (req, res) => {
  try {
    // 1. Check if player is logged in
    if (!req.session.player) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const playersCollection = getPlayersCollection();
    const username = req.session.player.username; // use the session player

    // 2. Delete the player from MongoDB
    const result = await playersCollection.deleteOne({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    // 3. Destroy the session after deletion
    req.session.destroy(err => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Failed to destroy session" });
      }
      res.json({ message: "Account deleted successfully" });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;