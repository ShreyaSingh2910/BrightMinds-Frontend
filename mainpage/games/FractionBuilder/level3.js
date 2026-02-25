const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const BASE_URL = "https://brightminds-backend-3.onrender.com";

function startBgMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});

  document.removeEventListener("click", startBgMusic);
  document.removeEventListener("touchstart", startBgMusic);
}

document.addEventListener("click", startBgMusic);
document.addEventListener("touchstart", startBgMusic);

function playCorrectSound() {
  if (!correctSound) return;

  if (bgMusic) bgMusic.volume = 0.15;

  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play();

  setTimeout(() => {
    if (bgMusic) bgMusic.volume = 0.35;
  }, 700);
}

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



function playWrongSound() {
  if (!wrongSound) return;

  if (bgMusic) bgMusic.volume = 0.15;

  wrongSound.pause();
  wrongSound.currentTime = 0;
  wrongSound.play();

  setTimeout(() => {
    if (bgMusic) bgMusic.volume = 0.35;
  }, 500);
}

const allData = [
  { a:{n:1,d:4}, b:{n:3,d:4} },
  { a:{n:1,d:2}, b:{n:1,d:3} },
  { a:{n:2,d:3}, b:{n:3,d:4} },
  { a:{n:3,d:5}, b:{n:4,d:6} },
  { a:{n:5,d:8}, b:{n:3,d:4} },
  { a:{n:2,d:5}, b:{n:4,d:5} },
  { a:{n:3,d:4}, b:{n:3,d:8} },
  { a:{n:4,d:6}, b:{n:2,d:3} },
  { a:{n:4,d:8}, b:{n:3,d:6} },
  { a:{n:5,d:6}, b:{n:2,d:4} }
];

const data = allData.sort(() => Math.random() - 0.5).slice(0, 5);

let index = 0;
let totalScore = 0;
const MAX_SCORE_PER_QUESTION = 2;


const leftSVG = document.getElementById("leftSVG");
const rightSVG = document.getElementById("rightSVG");
const leftText = document.getElementById("leftText");
const rightText = document.getElementById("rightText");
const resultMsg = document.getElementById("resultMsg");
const symbolBox = document.getElementById("symbolBox");
const celebration = document.getElementById("celebration");

load();

function load() {
  resultMsg.textContent = "";
  symbolBox.textContent = "VS";
  symbolBox.style.transform = "scale(1)";

  const q = data[index];
  leftText.textContent = `${q.a.n} / ${q.a.d}`;
  rightText.textContent = `${q.b.n} / ${q.b.d}`;

  draw(leftSVG, q.a.n, q.a.d);
  draw(rightSVG, q.b.n, q.b.d);
}

function draw(svg, n, d) {
  svg.innerHTML = "";
  const angle = 360 / d;

  for (let i = 0; i < n; i++) {
    const a1 = i * angle;
    const a2 = a1 + angle;

    const x1 = 100 + 100 * Math.cos(a1 * Math.PI / 180);
    const y1 = 100 + 100 * Math.sin(a1 * Math.PI / 180);
    const x2 = 100 + 100 * Math.cos(a2 * Math.PI / 180);
    const y2 = 100 + 100 * Math.sin(a2 * Math.PI / 180);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M100 100 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`
    );
    path.setAttribute("fill", "#7c4dff");
    svg.appendChild(path);
  }

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 100);
  circle.setAttribute("cy", 100);
  circle.setAttribute("r", 98);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#555");
  svg.appendChild(circle);
}

document.querySelectorAll(".options button").forEach(btn => {
  btn.addEventListener("click", () => {
    check(btn.dataset.symbol);
  });
});

function check(symbol) {

  const q = data[index];

  let correctSymbol = "=";
  if (q.a.n / q.a.d > q.b.n / q.b.d) correctSymbol = ">";
  else if (q.a.n / q.a.d < q.b.n / q.b.d) correctSymbol = "<";

  symbolBox.textContent = symbol;
  symbolBox.style.transform = "scale(1.2)";

  // Disable buttons (no second chance)
  document.querySelectorAll(".options button").forEach(btn => {
    btn.disabled = true;
  });

  if (symbol === correctSymbol) {

    playCorrectSound();

    resultMsg.textContent = "✅ Correct!";
    resultMsg.style.color = "green";

    totalScore += MAX_SCORE_PER_QUESTION;

  } else {

    playWrongSound();

    resultMsg.textContent = "❌ Wrong!";
    resultMsg.style.color = "red";
  }

  setTimeout(() => {

    symbolBox.style.transform = "scale(1)";
    index++;

    if (index >= data.length) {

      saveGameScore("FractionBuilder-level3", totalScore);
      showCelebration();

    } else {

      // Re-enable buttons
      document.querySelectorAll(".options button").forEach(btn => {
        btn.disabled = false;
      });

      load();
    }

  }, 1500);
}


let celebrationAnim = null;

function showCelebration() {

  document.querySelector(".celebration-card p").innerText =
    `Your Score: ${totalScore} / 10`;

  celebration.classList.remove("hidden");

  if (celebrationAnim) return;

  celebrationAnim = lottie.loadAnimation({
    container: document.getElementById("lottieCelebration"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration2.json"
  });
}

 
const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");

replayBtn.addEventListener("click", () => {
  celebration.classList.add("hidden");
  index = 0;
  totalScore = 0;

  document.querySelectorAll(".options button").forEach(btn => {
    btn.disabled = false;
  });

  load();
});


backBtn.addEventListener("click", () => {
  window.history.back();
  // OR use a fixed page:
  // window.location.href = "levels.html";
});
function goBack() {
  window.location.href="fraction.html";
}

