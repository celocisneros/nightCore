
//THIS SCRIPT GRABS A MONSTER BY NAME OR A RANDOM ONE
async function loadMonster(monsterName = "") {
    try {
      const res = await fetch(`/api/monsters/loadRandom`);
      const monster = await res.json();

      const container = document.getElementById("enemyStats");
      container.innerHTML = `
        <img src="${monster.profilePicPath}" alt="${monster.name}" width="150">
        <p>${monster.name}<p>
        <p>HP: ${monster.hp}</p>
        <p>Attack: ${monster.attack}</p>
      `;
    } catch (err) {
      console.error("Error loading monster:", err);
    }
  }

  // Load random monster with no name in parameters
  //loadMonster();