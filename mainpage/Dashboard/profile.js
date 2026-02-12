const API_BASE = "http://localhost:8080/api/game";
const currentUserEmail = localStorage.getItem("userEmail");
const BASE_URL = "https://brightminds-backend-3.onrender.com";

const data = {
  physics: {
    title: "Science Profile",
    badge: "Science Star",
    gameName: "ScienceSpotter"
  },
  math: {
    title: "Math Profile",
    badge: "Fraction Master",
    gameName: "FractionBuilder"
  },
  english: {
    title: "English Profile",
    badge: "Word Wizard",
    gameName: "WordBuilder"
  },
  social: {
    title: "Social Science Profile",
    badge: "City Champion",
    gameName: "MatchCity"
  },
  memory: {
    title: "Memory Profile",
    badge: "Memory King",
    gameName: "MemoryGame"
  }
};

function getAvatarImage(avatarName) {
  if (!avatarName) return "assets/avatars/fox.jpeg";
  return `assets/avatars/${avatarName}.jpeg`;
}

async function loadGame(gameKey, event) {

  document.querySelectorAll(".menu").forEach(m => m.classList.remove("active"));
  event.target.classList.add("active");

  const g = data[gameKey];

  document.getElementById("gameTitle").innerText = g.title;
  document.getElementById("badge").innerText = g.badge;

  try {
    const res = await fetch(
      `${BASE_URL}/api/game/profileData?email=${currentUserEmail}&gameName=${g.gameName}`
    );

    const p = await res.json();

    document.getElementById("username").innerText = p.name || "Player";
    document.querySelector(".profile-name").innerText = p.name || "Player";

    document.getElementById("scoreBig").innerText = p.totalScore ?? 0;

    document.getElementById("played").innerText = p.gamesPlayed ?? 0;
    document.getElementById("rank").innerText =
      p.rank > 0 ? `#${p.rank}` : "—";
    
    document.querySelector(
      ".profile-card-item:nth-child(1) b"
    ).innerText = Math.round(p.avgScore ?? 0);

    document.querySelector(
      ".profile-card-item:nth-child(2) b"
    ).innerText = p.joined
      ? new Date(p.joined).toDateString()
      : "-";

    const avatarImg = document.querySelector(".avatar");
    avatarImg.src = getAvatarImage(p.avatar);

    avatarImg.onerror = function () {
      this.src =getAvatarImage(data.avatar);
    };

    const recentRes = await fetch(
      `${BASE_URL}/api/game/recentGame?email=${currentUserEmail}`
    );
    const recentGame = await recentRes.text();

    document.querySelector(
      ".profile-card-item:nth-child(3) b"
    ).innerText = recentGame || "-";

  } catch (err) {
    console.error("Profile load failed:", err);
  }
}
function goBack() {
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadGame("physics", {
    target: document.querySelector(".menu.active")
  });
});




