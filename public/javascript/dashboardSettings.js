//this sends the file you upload to the uploads folder and saves the path in the current users player object in the database
document.getElementById('updatePicBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('uploadPic');
  const file = fileInput.files[0];
  if (!file) return alert('Select an image first!');

  const formData = new FormData();
  formData.append('profilePic', file);

  const res = await fetch('/api/update-profile-pic', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    document.getElementById('profilePic').src = data.profilePicPath;
  } else {
    alert(data.error);
  }
});

//this is to logout the current player
async function logout() {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login.html"; // redirect to login
}

//this will be to delete player and account and logout
  document.getElementById("deleteBtn").addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    const res = await fetch("/api/player-delete", { method: "DELETE", credentials: "include" });


    if (res.ok) {
      alert("Account deleted.");
      window.location.href = "/register.html"; // or wherever you want to redirect
    } else {
      const data = await res.json();
      alert("Error: " + data.message);
    }
  });
