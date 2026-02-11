const API_BASE = "http://localhost:8080/api/game";
const currentUserEmail = localStorage.getItem("userEmail");

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
  if (!avatarName) return "assets/fox-avtar.avif";
  return `avatars/${avatarName}.jpeg`;
}

// ---------------- LOAD GAME PROFILE ----------------
async function loadGame(gameKey, event) {

  // Highlight active menu
  document.querySelectorAll(".menu").forEach(m => m.classList.remove("active"));
  event.target.classList.add("active");

  const g = data[gameKey];

  // Static UI text
  document.getElementById("gameTitle").innerText = g.title;
  document.getElementById("badge").innerText = g.badge;

  try {
    // 🔹 Fetch profile data
    const res = await fetch(
      `${API_BASE}/profileData?email=${currentUserEmail}&gameName=${g.gameName}`
    );

    const p = await res.json();

    // -------- HEADER --------
    document.getElementById("username").innerText = p.name || "Player";
    document.querySelector(".profile-name").innerText = p.name || "Player";

    // -------- SCORE PANEL --------
    document.getElementById("scoreBig").innerText = p.totalScore ?? 0;

    // -------- GAME STATS --------
    document.getElementById("played").innerText = p.gamesPlayed ?? 0;
    document.getElementById("rank").innerText =
      p.rank > 0 ? `#${p.rank}` : "—";

    // -------- AVG SCORE --------
    document.querySelector(
      ".profile-card-item:nth-child(1) b"
    ).innerText = Math.round(p.avgScore ?? 0);

    // -------- JOIN DATE --------
    document.querySelector(
      ".profile-card-item:nth-child(2) b"
    ).innerText = p.joined
      ? new Date(p.joined).toDateString()
      : "-";

    // -------- AVATAR --------
    const avatarImg = document.querySelector(".avatar");
    avatarImg.src = getAvatarImage(p.avatar);

    avatarImg.onerror = function () {
      this.src =getAvatarImage(data.avatar);
    };

    // -------- RECENTLY PLAYED --------
    const recentRes = await fetch(
      `${API_BASE}/recentGame?email=${currentUserEmail}`
    );
    const recentGame = await recentRes.text();

    document.querySelector(
      ".profile-card-item:nth-child(3) b"
    ).innerText = recentGame || "-";

  } catch (err) {
    console.error("Profile load failed:", err);
  }
}

// ---------------- BACK BUTTON ----------------
function goBack() {
  window.location.href = "../index2.html";
}

// ---------------- INITIAL LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
  loadGame("physics", {
    target: document.querySelector(".menu.active")
  });
});


