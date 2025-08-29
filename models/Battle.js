const mongoose = require("mongoose");

// Schema = defines what data looks like
const battleSchema = new mongoose.Schema({
  player: {
    name: String,
    hp: Number,
    attack: Number,
    defense: Number
  },
  enemy: {
    name: String,
    hp: Number,
    attack: Number,
    defense: Number
  },
  turn: String
});

// Model = object we use to interact with the database
const Battle = mongoose.model("Battle", battleSchema);

module.exports = Battle;
