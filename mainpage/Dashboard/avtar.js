let selectedAvatar = null;

const avatars = document.querySelectorAll(".avatar-grid img");
const saveBtn = document.getElementById("saveProfile");

avatars.forEach(img => {
  img.addEventListener("click", () => {
    avatars.forEach(a => a.classList.remove("selected"));
    img.classList.add("selected");
    selectedAvatar = img.dataset.avatar;
  });
});

saveBtn.addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();

  if (!name) {
    alert("Please enter your name 😊");
    return;
  }

  if (!selectedAvatar) {
    alert("Please choose an avatar 🐼🦄");
    return;
  }

  const profileData = {
    name,
    avatar: selectedAvatar,
    createdAt: Date.now()
  };

localStorage.setItem("avatarCreated", "true");
window.location.href = "../index.html";


});

