
//THIS SCRIPT GRABS A MONSTER BY NAME OR A RANDOM ONE
async function loadMonster(monsterName = "") {
    try {
      const res = await fetch(`/api/monsters/${monsterName}`);
      const monster = await res.json();

      const container = document.getElementById("monster-container");
      container.innerHTML = `
        <h3>${monster.name}</h3>
        <p>HP: ${monster.hp}</p>
        <p>Attack: ${monster.attack}</p>
        <img src="${monster.imageUrl}" alt="${monster.name}" width="150">
      `;
    } catch (err) {
      console.error("Error loading monster:", err);
    }
  }

  // Load random monster when battle starts
  loadMonster();