async function loadProfile() {
  try {
    const res = await fetch("/api/current-user");
    const data = await res.json();
    if (!data.player) {
      document.getElementById("profile").innerText = "Not logged in.";
      return;
    }

//creates a variable named player from the player object we fetched
    const player = data.player;
    
    document.getElementById("profile").innerHTML = 
    `username: ${player.username}<br>
    level: ${player.level}<br> 
    hp: ${player.hp}<br>
    yen: ${player.yen}<br> 
    xp: ${player.xp}<br>
    attack: ${player.attack}<br>
    defense: ${player.defense}`;
    console.log(`now logging the current player object to the console`);
    console.log(player);
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

loadProfile();

async function loadProfilePic() {
  try {
    const res = await fetch("/api/current-user");
    const data = await res.json();

    if (!data.player) {
      document.getElementById("profile").innerText = "Not logged in.";
      return;
    }

    // Example: show username + stats
    const player = data.player;
    document.getElementById("profilePic").src = player.profilePicPath;
  } catch (err) {
    console.error("Error loading profile picture:", err);
  }
}

loadProfilePic();