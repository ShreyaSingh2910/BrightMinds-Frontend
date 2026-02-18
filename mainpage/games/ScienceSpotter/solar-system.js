const BASE_URL = "https://brightminds-backend-3.onrender.com";
let totalScore = 0;
let planetAttempts = 0;   // attempts for current planet

function saveGameScore(gameName, score) {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  fetch(`${BASE_URL}/api/game/saveScore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      gameName: gameName,
      score: score
    })
  }).catch(err => console.error("Score save failed", err));
}



const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const startMessage = document.getElementById("startMessage");


bgMusic.volume = 0.30;
correctSound.volume = 1;
wrongSound.volume = 1;

let audioStarted = false;

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;

  [correctSound, wrongSound].forEach(audio => {
    audio.muted = true;
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {});
  });

  bgMusic.play().catch(() => {});
}

window.addEventListener("pointerdown", startAudio, { once: true });

const planets = document.querySelectorAll(".planet");
const panel = document.querySelector(".panel");
const options = document.querySelectorAll(".options button");
const message = document.getElementById("message");
const hintBtn = document.getElementById("hintBtn");
const hintText = document.getElementById("hintText");
const final = document.getElementById("final");

let current = null;
let hintIndex = 0;
let solved = 0;

const data = {
  Mercury: {
    options: ["Venus", "Earth", "Mars","Mercury"],
    answer: "Mercury",
    hints: ["Closest to Sun", "Smallest planet", "No atmosphere"]
  },
  Venus: {
    options: ["Earth", "Mars","Venus", "Mercury"],
    answer: "Venus",
    hints: ["Hottest planet", "2nd from Sun", "Thick clouds"]
  },
  Earth: {
    options: ["Mars", "Earth", "Venus", "Mercury"],
    answer: "Earth",
    hints: ["Supports life", "3rd from Sun", "Humans live here"]
  },
  Moon: {
    options: ["Moon", "Mars", "Venus", "Mercury"],
    answer: "Moon",
    hints: ["Earth’s natural satellite", "No atmosphere", "Seen at night"]
  },
  Mars: {
    options: ["Earth",  "Venus", "Mercury","Mars"],
    answer: "Mars",
    hints: ["Red planet", "4th from Sun", "Robots explored me"]
  },
  Jupiter: {
    options: [ "Saturn", "Neptune","Jupiter", "Mars"],
    answer: "Jupiter",
    hints: ["Largest planet", "Big red spot", "Gas giant"]
  },
  Saturn: {
    options: [ "Jupiter","Saturn", "Uranus", "Neptune"],
    answer: "Saturn",
    hints: ["Has rings", "Gas giant", "6th planet"]
  },
  Uranus: {
    options: ["Uranus", "Neptune", "Saturn", "Earth"],
    answer: "Uranus",
    hints: ["Rotates sideways", "Ice giant", "Blue-green"]
  },
  Neptune: {
    options: [ "Uranus", "Saturn", "Jupiter","Neptune"],
    answer: "Neptune",
    hints: ["Farthest planet", "Very windy", "Blue"]
  }
};
planets.forEach(planet => {
  planet.addEventListener("click", () => {
    // 📝 hide start instruction on first planet click
startMessage?.classList.add("hide");

    if (planet.classList.contains("locked")) return;

    planets.forEach(p => p.classList.remove("active"));
    planet.classList.add("active");

    const name = planet.dataset.name;
    current = data[name];
    hintIndex = 0;
    planetAttempts = 0;   // reset attempts for this planet

    message.textContent = "";
    hintText.textContent = "";

    options.forEach((btn, i) => {
      btn.textContent = current.options[i];
      btn.className = "";
    });

    panel.classList.remove("hidden");
  });
});

options.forEach(btn => {
  btn.addEventListener("click", () => {
  
    if (!current) return;
    planetAttempts++;

    if (btn.textContent === current.answer) {
      btn.classList.add("correct");
      message.textContent = `🎉 Correct! This is ${current.answer}`;

      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});

      document
        .querySelector(`.planet[data-name="${current.answer}"]`)
        .classList.add("locked");

      // Calculate score for this planet
let planetScore;

if (planetAttempts === 1) {
  planetScore = 3;
} else if (planetAttempts === 2) {
  planetScore = 2;
} else if (planetAttempts === 3) {
  planetScore = 1;
} else {
  planetScore = 0;
}

totalScore += planetScore;

solved++;
current = null;
if (solved === Object.keys(data).length) {

  saveGameScore("ScienceSpotter-SolarSystem", totalScore);

  const finalMessage = document.getElementById("finalMessage");

  finalMessage.innerHTML = `
    ⭐ You explored all planets! ⭐ <br><br>
    🌟 Your Score: <b>${totalScore} / 27</b>
  `;
showFinal();

}

display 
    } else {
      btn.classList.add("wrong");
      message.textContent = "❌ Not quite, try again";

      wrongSound.currentTime = 0;
      wrongSound.play().catch(() => {});
    }
  });
});

hintBtn.addEventListener("click", () => {
  if (!current) return;

  if (hintIndex < current.hints.length) {
    hintText.textContent = current.hints[hintIndex++];
  } else {
    hintText.textContent = "No more hints 🙂";
  }

});

function showFinal() {

  // Hide everything except popup
  document.querySelector(".solar-wrapper").style.display = "none";
  document.querySelector(".panel").style.display = "none";
  document.querySelector(".start-message").style.display = "none";
  document.querySelector(".title").style.display = "none";

  // Show popup
  document.getElementById("final").classList.remove("hidden");
}
