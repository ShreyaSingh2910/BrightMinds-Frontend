const partsArea = document.querySelector(".parts-area");
const dropZone = document.getElementById("dropZone");
const filledSVG = document.getElementById("filledSVG");
const wholeSVG = document.getElementById("wholeSVG");
const submitBtn = document.getElementById("submitBtn");
const resultMsg = document.getElementById("resultMsg");
const instruction = document.querySelector(".instruction");

const successOverlay = document.getElementById("successOverlay");
const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");

const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
let totalScore = 0;
const MAX_SCORE_PER_QUESTION = 2;


const BASE_URL = "https://brightminds-backend-3.onrender.com";

function startMusicOnce() {
  if (!bgMusic) return;
  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});
  document.removeEventListener("click", startMusicOnce);
  document.removeEventListener("touchstart", startMusicOnce);
}
document.addEventListener("click", startMusicOnce);
document.addEventListener("touchstart", startMusicOnce);

function playCorrectSound() {
  if (!correctSound) return;
  bgMusic && (bgMusic.volume = 0.15);
  correctSound.currentTime = 0;
  correctSound.play();
  setTimeout(() => bgMusic && (bgMusic.volume = 0.35), 700);
}

function playWrongSound() {
  if (!wrongSound) return;
  bgMusic && (bgMusic.volume = 0.15);
  wrongSound.currentTime = 0;
  wrongSound.play();
  setTimeout(() => bgMusic && (bgMusic.volume = 0.35), 500);
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


const ALL_FRACTIONS = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 4 },
  { numerator: 3, denominator: 5 },
  { numerator: 2, denominator: 5 },
  { numerator: 4, denominator: 5 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 4 }
];

function getRandomFractions(pool, count) {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

const fractions = getRandomFractions(ALL_FRACTIONS, 5);

let currentIndex = 0;
let currentFraction;
let placed = 0;
let activePart = null;
let occupiedSlots = new Set();

function getShapeType(den) {
  return den === 4 ? "square" : "circle";
}

initRound();

function initRound() {
  placed = 0;
  activePart = null;
  occupiedSlots.clear();
  filledSVG.innerHTML = "";
  wholeSVG.innerHTML = "";
  resultMsg.textContent = "";

  currentFraction = fractions[currentIndex];
  instruction.innerHTML =
    `Build the fraction: <b>${currentFraction.numerator} / ${currentFraction.denominator}</b>`;

  const shape = getShapeType(currentFraction.denominator);
  shape === "circle"
    ? drawWholeCircle(currentFraction.denominator)
    : drawWholeSquare();

  buildParts(currentFraction.denominator, shape);
}

function drawWholeCircle(den) {
  wholeSVG.appendChild(svg("circle", {
    cx: 100, cy: 100, r: 98,
    fill: "#f6f2ff", stroke: "#777", "stroke-width": 2
  }));

  for (let i = 0; i < den; i++) {
    const a = (360 / den) * i * Math.PI / 180;
    wholeSVG.appendChild(svg("line", {
      x1: 100, y1: 100,
      x2: 100 + 100 * Math.cos(a),
      y2: 100 + 100 * Math.sin(a),
      stroke: "#777"
    }));
  }
}

function drawWholeSquare() {
  const start = 20, size = 160, half = size / 2;

  wholeSVG.appendChild(svg("rect", {
    x: start, y: start, width: size, height: size,
    fill: "#f6f2ff", stroke: "#777", "stroke-width": 2
  }));

  wholeSVG.appendChild(svg("line", {
    x1: start + half, y1: start,
    x2: start + half, y2: start + size,
    stroke: "#777"
  }));

  wholeSVG.appendChild(svg("line", {
    x1: start, y1: start + half,
    x2: start + size, y2: start + half,
    stroke: "#777"
  }));
}

function buildParts(count, shape) {
  partsArea.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "part-item";
    if (shape === "square") p.classList.add("square-part");
    p.draggable = true;
    p.dataset.index = i;
    p.addEventListener("dragstart", () => activePart = p);
    partsArea.appendChild(p);
  }
}

dropZone.addEventListener("dragover", e => e.preventDefault());
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (!activePart || activePart.classList.contains("used")) return;

  const rect = dropZone.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  getShapeType(currentFraction.denominator) === "circle"
    ? placeCircleSlice(x, y)
    : placeSquarePart(x, y);
});

function placeCircleSlice(x, y) {
  const cx = 110, cy = 110;
  const dx = x - cx, dy = y - cy;
  if (Math.hypot(dx, dy) > 100) return;

  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle < 0) angle += 360;

  const d = currentFraction.denominator;
  const sliceAngle = 360 / d;
  const index = Math.floor(angle / sliceAngle);
  if (occupiedSlots.has(index)) return;

  const a1 = index * sliceAngle * Math.PI / 180;
  const a2 = (index + 1) * sliceAngle * Math.PI / 180;

  const slice = svg("path", {
    d: `M100 100
        L${100 + 100*Math.cos(a1)} ${100 + 100*Math.sin(a1)}
        A100 100 0 0 1 ${100 + 100*Math.cos(a2)} ${100 + 100*Math.sin(a2)}
        Z`,
    fill: "#7c4dff"
  });

  slice.dataset.index = index;
  enableTapToRemove(slice);
  filledSVG.appendChild(slice);

  occupiedSlots.add(index);
  activePart.classList.add("used");
  placed++;
}

function placeSquarePart(x, y) {
  const start = 20, size = 160, half = size / 2;
  if (x < start || y < start || x > start + size || y > start + size) return;

  const col = Math.floor((x - start) / half);
  const row = Math.floor((y - start) / half);
  const index = row * 2 + col;
  if (occupiedSlots.has(index)) return;

  const rect = svg("rect", {
    x: start + col * half,
    y: start + row * half,
    width: half,
    height: half,
    fill: "#7c4dff"
  });

  rect.dataset.index = index;
  enableTapToRemove(rect);
  filledSVG.appendChild(rect);

  occupiedSlots.add(index);
  activePart.classList.add("used");
  placed++;
}

function enableTapToRemove(el) {
  el.addEventListener("click", () => {
    const index = Number(el.dataset.index);
    filledSVG.removeChild(el);
    occupiedSlots.delete(index);
    placed--;

    const used = document.querySelector(".part-item.used");
    used && used.classList.remove("used");
  });
}

submitBtn.addEventListener("click", () => {

  // Disable submit button to prevent multiple clicks
  submitBtn.disabled = true;

  if (placed === currentFraction.numerator) {

    playCorrectSound();

    resultMsg.textContent = "✅ Correct!";
    resultMsg.style.color = "green";

    totalScore += MAX_SCORE_PER_QUESTION;

  } else {

    playWrongSound();

    resultMsg.textContent = "❌ Wrong!";
    resultMsg.style.color = "red";
  }

  // Show result for 1.5 seconds
  setTimeout(() => {
    nextRound();
    submitBtn.disabled = false;
  }, 1500);
});


function nextRound() {
  currentIndex++;
  if (currentIndex >= fractions.length) {
  saveGameScore("FractionBuilder-level1", totalScore);
    showSuccessScreen();
    return;
  }
  initRound();
}
function showSuccessScreen() {
  document.querySelector(".success-card p").innerText =
    `Your Score: ${totalScore} / 10`;

  successOverlay.classList.add("show");

  lottie.loadAnimation({
    container: document.getElementById("successLottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration2.json"
  });
}

replayBtn.addEventListener("click", () => window.location.reload());
backBtn.addEventListener("click", () => window.history.back());

function svg(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let k in attrs) el.setAttribute(k, attrs[k]);
  return el;

}

function goBack() {
  window.location.href = "fraction.html";
}
