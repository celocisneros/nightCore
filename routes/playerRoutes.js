const multer = require('multer');
const { ObjectId } = require('mongodb');
const path = require('path');
const express = require("express");
const router = express.Router();
const { client } = require("../db");

// make uploads folder accessible
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // make sure uploads folder exists
  filename: (req, file, cb) => {
    // Use player ID to avoid duplicate files
    if (!req.session || !req.session.player) return cb(new Error('No player in session'));
    const ext = path.extname(file.originalname); // preserve extension
    cb(null, req.session.player._id + ext);
  }
});
const upload = multer({ storage });

//grab the current player object
router.get("/current-user", (req, res) => {
  if (req.session && req.session.player) {
    res.json({ player: req.session.player });  // already full player object
  } else {
    res.json({ player: null });
  }
});

//update the profile pic for current player in session
router.post('/update-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    // Check if player is logged in
    if (!req.session || !req.session.player) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build the file path for front-end
    const filePath = '/uploads/' + req.file.filename;

    // Update MongoDB using session player _id
    const db = client.db('nightcore');
    const players = db.collection('players');

    await players.updateOne(
      { _id: new ObjectId(req.session.player._id) },
      { $set: { profilePicPath: filePath } }
    );

    // Update session object so front-end sees new pic immediately
    req.session.player.profilePicPath = filePath;

    res.json({ success: true, profilePicPath: filePath });

  } catch (err) {
    console.error('Error updating profile pic:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;