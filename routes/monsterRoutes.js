const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const { client, connectDB, getPlayersCollection } = require("../db");


router.get("/loadRandom", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("nightcore");
    const monstersCollection = db.collection("monsters");

    let monster;
    if (req.params.name) {
      monster = await monstersCollection.findOne({ name: req.params.name });
    } else {
      // Pick random monster
      const monsters = await monstersCollection.aggregate([{ $sample: { size: 1 } }]).toArray();
      monster = monsters[0];
    }

    if (!monster) {
      return res.status(404).json({ error: "Monster not found" });
    }

    res.json(monster);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    await client.close();
  }
});

module.exports = router;