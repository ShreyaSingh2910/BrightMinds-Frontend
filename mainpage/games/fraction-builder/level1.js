const partsArea = document.querySelector(".parts-area");
const dropZone = document.getElementById("dropZone");
const filledSVG = document.getElementById("filledSVG");
const wholeSVG = document.getElementById("wholeSVG");
const checkBtn = document.getElementById("checkBtn");
const resultMsg = document.getElementById("resultMsg");
const instruction = document.querySelector(".instruction");

const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

/* 🎵 Start background music after first user interaction */
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

  if (bgMusic) bgMusic.volume = 0.15;

  correctSound.pause();
  correctSound.currentTime = 0;
  correctSound.play();

  setTimeout(() => {
    if (bgMusic) bgMusic.volume = 0.35;
  }, 700);
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

/* ---------------- FRACTIONS ---------------- */
const fractions = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 }, // square
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 }
];

let currentIndex = 0;
let currentFraction;
let placed = 0;
let activePart = null;

/* ---------------- SHAPE HELPER ---------------- */
function getShapeType(denominator) {
  return denominator === 4 ? "square" : "circle";
}

/* ---------------- INIT ---------------- */
initRound();

/* ---------------- INIT ROUND ---------------- */
function initRound() {
  placed = 0;
  activePart = null;
  filledSVG.innerHTML = "";
  wholeSVG.innerHTML = "";
  resultMsg.textContent = "";

  currentFraction = fractions[currentIndex];

  instruction.innerHTML =
    `Build the fraction: <b>${currentFraction.numerator} / ${currentFraction.denominator}</b>`;

  const shape = getShapeType(currentFraction.denominator);

  if (shape === "circle") {
    drawWholeCircle(currentFraction.denominator);
  } else {
    drawWholeSquare();
  }

  buildParts(currentFraction.denominator, shape);
}

/* ---------------- DRAW WHOLE CIRCLE ---------------- */
function drawWholeCircle(denominator) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 100);
  circle.setAttribute("cy", 100);
  circle.setAttribute("r", 98);
  circle.setAttribute("fill", "#f6f2ff");
  circle.setAttribute("stroke", "#777");
  circle.setAttribute("stroke-width", "2");
  wholeSVG.appendChild(circle);

  for (let i = 0; i < denominator; i++) {
    const angle = (360 / denominator) * i;
    const rad = (angle * Math.PI) / 180;

    const x = 100 + 100 * Math.cos(rad);
    const y = 100 + 100 * Math.sin(rad);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 100);
    line.setAttribute("y1", 100);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#777");

    wholeSVG.appendChild(line);
  }
}

/* ---------------- DRAW WHOLE SQUARE ---------------- */
function drawWholeSquare() {
  const start = 20;
  const size = 160;
  const half = size / 2;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", start);
  rect.setAttribute("y", start);
  rect.setAttribute("width", size);
  rect.setAttribute("height", size);
  rect.setAttribute("fill", "#f6f2ff");
  rect.setAttribute("stroke", "#777");
  rect.setAttribute("stroke-width", "2");
  wholeSVG.appendChild(rect);

  const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  vLine.setAttribute("x1", start + half);
  vLine.setAttribute("y1", start);
  vLine.setAttribute("x2", start + half);
  vLine.setAttribute("y2", start + size);
  vLine.setAttribute("stroke", "#777");

  const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  hLine.setAttribute("x1", start);
  hLine.setAttribute("y1", start + half);
  hLine.setAttribute("x2", start + size);
  hLine.setAttribute("y2", start + half);
  hLine.setAttribute("stroke", "#777");

  wholeSVG.appendChild(vLine);
  wholeSVG.appendChild(hLine);
}

/* ---------------- BUILD PARTS ---------------- */
function buildParts(denominator, shape) {
  partsArea.innerHTML = "";

  for (let i = 0; i < denominator; i++) {
    const part = document.createElement("div");
    part.className = "part-item";
    part.setAttribute("draggable", "true");
    part.dataset.index = i;

    if (shape === "square") {
      part.classList.add("square-part");
    }

    part.addEventListener("dragstart", () => {
      activePart = part;
    });

    partsArea.appendChild(part);
  }
}

/* ---------------- DROP INTO SHAPE ---------------- */
dropZone.addEventListener("dragover", e => e.preventDefault());

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (!activePart || activePart.classList.contains("used")) return;
  if (placed >= currentFraction.denominator) return;

  const shape = getShapeType(currentFraction.denominator);

  /* -------- CIRCLE -------- */
  if (shape === "circle") {
    const sliceAngle = 360 / currentFraction.denominator;
    const startAngle = placed * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    const x1 = 100 + 100 * Math.cos(startAngle * Math.PI / 180);
    const y1 = 100 + 100 * Math.sin(startAngle * Math.PI / 180);
    const x2 = 100 + 100 * Math.cos(endAngle * Math.PI / 180);
    const y2 = 100 + 100 * Math.sin(endAngle * Math.PI / 180);

    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute(
      "d",
      `M100 100 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`
    );
    slice.setAttribute("fill", "#7c4dff");
    slice.style.cursor = "pointer";
    slice.style.pointerEvents = "all";
    slice.dataset.index = activePart.dataset.index;

    enableTapToRemove(slice);
    filledSVG.appendChild(slice);
  }

  /* -------- SQUARE -------- */
  else {
    const start = 20;
    const size = 160;
    const half = size / 2;

    const positions = [
      { x: start, y: start },
      { x: start + half, y: start },
      { x: start, y: start + half },
      { x: start + half, y: start + half }
    ];

    const pos = positions[placed];

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", pos.x);
    rect.setAttribute("y", pos.y);
    rect.setAttribute("width", half);
    rect.setAttribute("height", half);
    rect.setAttribute("fill", "#7c4dff");
    rect.style.cursor = "pointer";
    rect.style.pointerEvents = "all";
    rect.dataset.index = activePart.dataset.index;

    enableTapToRemove(rect);
    filledSVG.appendChild(rect);
  }

  activePart.classList.add("used");
  placed++;
});

/* ---------------- TAP / CLICK TO REMOVE ---------------- */
function enableTapToRemove(el) {
  el.addEventListener("click", () => {
    const index = el.dataset.index;

    if (!filledSVG.contains(el)) return;

    filledSVG.removeChild(el);
    placed--;

    const trayPart = document.querySelector(
      `.part-item[data-index="${index}"]`
    );
    if (trayPart) trayPart.classList.remove("used");
  });
}

/* ---------------- CHECK ---------------- */
checkBtn.addEventListener("click", () => {
  if (placed === currentFraction.numerator) {
    playCorrectSound();
    resultMsg.textContent = "🎉 Correct!";
    resultMsg.style.color = "green";
    setTimeout(nextRound, 1200);
  } else {
     playWrongSound();
    resultMsg.textContent = "Tap a piece to remove 😊";
    resultMsg.style.color = "orange";
  }
});

/* ---------------- NEXT ROUND ---------------- */
function nextRound() {
  currentIndex++;

  if (currentIndex >= fractions.length) {
    showSuccessScreen();
    return;
  }

  initRound();
}

const successOverlay = document.getElementById("successOverlay");
const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");

/* 🎉 SHOW SUCCESS */
function showSuccessScreen() {
  successOverlay.classList.add("show");

  lottie.loadAnimation({
    container: document.getElementById("successLottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    // 🎉 Kid-friendly celebration animation
    path: "lottie/celebration2.json"
  });
}

/* 🔁 REPLAY */
replayBtn.addEventListener("click", () => {
  window.location.reload();
});

/* ⬅ BACK */
backBtn.addEventListener("click", () => {
  window.history.back();
});
function goBack() {
  window.location.href="fraction.html";
}

