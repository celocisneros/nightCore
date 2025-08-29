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

//import the BASIC battle schema model 
const Battle = require("./models/Battle");

//grabs a system message by the objects "alert" key
app.get("/api/system/:alert", async (req, res) => {
  try {
    const db = client.db("nightcore"); // select database
    const collection = db.collection("system"); // select collection
    const alert = req.params.alert; //find document by alert
    const message = await collection.findOne({ alert }); // fetch one document
    res.json(message); // send document as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching message"); // send error if fails
  }
});

//Route: grab a user by name in the users collection in the nightCore database
app.get("/api/user/:name", async (req, res) => {
  try{
    const db = client.db("nightcore");
    const collection = db.collection("users");
    const name = req.params.name;
    const user = await collection.findOne({ name });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

async function initBattle() {
  let existing = await Battle.findOne(); // look for an existing battle
  if (!existing) {
    // If no battle exists, create one
    const battle = new Battle({
      player: { name: "Hero", hp: 100, attack: 20, defense: 5 },
      enemy: { name: "Slime", hp: 80, attack: 10, defense: 2 },
      turn: "player"
    });
    await battle.save();
    console.log("✅ Battle initialized in database");
  }
}

initBattle();

app.get("/battle", async (req, res) => {
  const battle = await Battle.findOne();
  res.json(battle);
});

app.post("/battle/attack", async (req, res) => {
  const battle = await Battle.findOne();

  if (battle.turn !== "player") {
    return res.json({ message: "Not your turn!", battle });
  }

  const damage = Math.max(battle.player.attack - battle.enemy.defense, 1);
  battle.enemy.hp -= damage;

  let result = `${battle.player.name} attacks ${battle.enemy.name} for ${damage} damage!`;

  if (battle.enemy.hp <= 0) {
    result += `\n${battle.enemy.name} is defeated!`;
  } else {
    battle.turn = "enemy";
  }

  await battle.save(); // save updated state
  res.json({ result, battle });
});

app.post("/battle/enemy-turn", async (req, res) => {
  const battle = await Battle.findOne();

  if (battle.turn !== "enemy") {
    return res.json({ message: "Not enemy's turn!", battle });
  }

  const damage = Math.max(battle.enemy.attack - battle.player.defense, 1);
  battle.player.hp -= damage;

  let result = `${battle.enemy.name} attacks ${battle.player.name} for ${damage} damage!`;

  if (battle.player.hp <= 0) {
    result += `\n${battle.player.name} is defeated!`;
  } else {
    battle.turn = "player";
  }

  await battle.save(); // save updated state
  res.json({ result, battle });
});


// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
