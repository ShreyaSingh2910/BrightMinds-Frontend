/* ================= ELEMENTS ================= */
const partsArea = document.getElementById("partsArea");
const filledSVG = document.getElementById("filledSVG");
const rightWhole = document.getElementById("rightWhole");
const rightFraction = document.getElementById("rightFraction");
const leftFractionText = document.getElementById("leftFraction");
const dropZone = document.getElementById("dropZone");
const checkBtn = document.getElementById("checkBtn");
const resultMsg = document.getElementById("resultMsg");

const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function startMusicOnce() {
  if (!bgMusic) return;

  bgMusic.volume = 0.4;
  bgMusic.play().catch(() => {});
  document.removeEventListener("click", startMusicOnce);
}

document.addEventListener("click", startMusicOnce);


document.addEventListener("click", startMusicOnce);

/* ================= LEVEL DATA ================= */
const All_levels = [
  { left: { n: 1, d: 2 }, right: { n: 3, d: 6 } },
  { left: { n: 1, d: 3 }, right: { n: 2, d: 6 } },
  { left: { n: 1, d: 4 }, right: { n: 2, d: 8 } },
  { left: { n: 2, d: 3 }, right: { n: 4, d: 6 } },
  { left: { n: 3, d: 6 }, right: { n: 1, d: 2 } },
  { left: { n: 1, d: 2 }, right: { n: 2, d: 4 } },
  { left: { n: 2, d: 4 }, right: { n: 4, d: 8 } },
   { left: { n: 3, d: 4 }, right: { n: 6, d: 8 } },
];

function pickRandomLevels(all, count) {
  const usedLeft = new Set();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const result = [];

  for (const level of shuffled) {
    const key = `${level.left.n}/${level.left.d}`;
    if (!usedLeft.has(key)) {
      usedLeft.add(key);
      result.push(level);
    }
    if (result.length === count) break;
  }

  return result;
}


const levels = pickRandomLevels(All_levels, 5);

let levelIndex = 0;
let placedIndexes = [];
let activePart = null;

/* ================= INIT ================= */
initLevel();

/* ================= INIT LEVEL ================= */
function initLevel() {
  placedIndexes = [];
  activePart = null;
  partsArea.innerHTML = "";
  filledSVG.innerHTML = "";
  rightWhole.innerHTML = "";
  resultMsg.textContent = "";

  const current = levels[levelIndex];

  // Left text
  leftFractionText.textContent = `${current.left.n} / ${current.left.d}`;

  // Left visual
  drawLeftCircle(current.left.n, current.left.d);

  // Right visual
  drawRightCircle(current.right.d);

  // Parts
  buildParts(current.right.d);

  updateRightFraction();
}

/* ================= LEFT CIRCLE ================= */
function drawLeftCircle(n, d) {
  const svg = document.querySelector(".side svg");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 200 200");

  const sliceAngle = 360 / d;

  for (let i = 0; i < n; i++) {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    const x1 = 100 + 100 * Math.cos(start * Math.PI / 180);
    const y1 = 100 + 100 * Math.sin(start * Math.PI / 180);
    const x2 = 100 + 100 * Math.cos(end * Math.PI / 180);
    const y2 = 100 + 100 * Math.sin(end * Math.PI / 180);

    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute(
      "d",
      `M100 100 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`
    );
    slice.setAttribute("fill", "#009688");
    svg.appendChild(slice);
  }

  const outline = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  outline.setAttribute("cx", 100);
  outline.setAttribute("cy", 100);
  outline.setAttribute("r", 98);
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", "#555");
  outline.setAttribute("stroke-width", "2");
  svg.appendChild(outline);
}

/* ================= RIGHT EMPTY CIRCLE ================= */
function drawRightCircle(d) {
  rightWhole.setAttribute("viewBox", "0 0 200 200");

  const outline = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  outline.setAttribute("cx", 100);
  outline.setAttribute("cy", 100);
  outline.setAttribute("r", 98);
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", "#555");
  outline.setAttribute("stroke-width", "2");
  rightWhole.appendChild(outline);

  for (let i = 0; i < d; i++) {
    const angle = (360 / d) * i;
    const rad = angle * Math.PI / 180;

    const x = 100 + 100 * Math.cos(rad);
    const y = 100 + 100 * Math.sin(rad);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 100);
    line.setAttribute("y1", 100);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#555");
    rightWhole.appendChild(line);
  }
}

/* ================= PARTS ================= */
function buildParts(count) {
  for (let i = 0; i < count; i++) {
    const part = document.createElement("div");
    part.className = "part";
    part.draggable = true;
    part.dataset.index = i;

    part.addEventListener("dragstart", () => {
      activePart = part;
    });

    partsArea.appendChild(part);
  }
}

/* ================= DROP ================= */
dropZone.addEventListener("dragover", e => e.preventDefault());

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (!activePart || activePart.classList.contains("used")) return;

  const d = levels[levelIndex].right.d;
  if (placedIndexes.length >= d) return;

  placedIndexes.push(activePart.dataset.index);
  activePart.classList.add("used");

  redrawFilledSlices();
  updateRightFraction();
});

/* ================= FILLED SLICES ================= */
function redrawFilledSlices() {
  filledSVG.innerHTML = "";
  filledSVG.setAttribute("viewBox", "0 0 200 200");

  const d = levels[levelIndex].right.d;
  const sliceAngle = 360 / d;

  placedIndexes.forEach((idx, i) => {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    const x1 = 100 + 100 * Math.cos(start * Math.PI / 180);
    const y1 = 100 + 100 * Math.sin(start * Math.PI / 180);
    const x2 = 100 + 100 * Math.cos(end * Math.PI / 180);
    const y2 = 100 + 100 * Math.sin(end * Math.PI / 180);

    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute(
      "d",
      `M100 100 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`
    );
    slice.setAttribute("fill", "#009688");
    slice.style.cursor = "pointer";

    slice.addEventListener("click", () => removeSlice(idx));
    filledSVG.appendChild(slice);
  });
}

/* ================= REMOVE ================= */
function removeSlice(idx) {
  placedIndexes = placedIndexes.filter(i => i !== idx);

  const part = document.querySelector(`.part[data-index="${idx}"]`);
  if (part) part.classList.remove("used");

  redrawFilledSlices();
  updateRightFraction();
}

/* ================= FRACTION TEXT ================= */
function updateRightFraction() {
  const d = levels[levelIndex].right.d;
  rightFraction.textContent =
    placedIndexes.length === 0
      ? `? / ${d}`
      : `${placedIndexes.length} / ${d}`;
}

/* ================= CHECK ================= */
checkBtn.addEventListener("click", () => {
  const current = levels[levelIndex];

  if (placedIndexes.length === current.right.n) {

    if (correctSound) {
      correctSound.pause();
      correctSound.currentTime = 0;
      correctSound.play();
    }

    resultMsg.textContent =
      `${current.left.n}/${current.left.d} is equal to ${current.right.n}/${current.right.d}.`;
    resultMsg.style.color = "green";

    setTimeout(nextLevel, 1500);

  } else {

    if (wrongSound) {
      wrongSound.pause();
      wrongSound.currentTime = 0;
      wrongSound.play();
    }

    resultMsg.textContent = "Try adjusting the pieces 😊";
    resultMsg.style.color = "orange";
  }
});

const celebration = document.getElementById("celebration");
const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");

function showCelebration() {
  celebration.classList.remove("hidden");
  initCelebrationLottie();
}


/* Replay game */
replayBtn.addEventListener("click", () => {
  celebration.classList.add("hidden");
  levelIndex = 0;
  initLevel();
});

/* Back button (customize as needed) */
backBtn.addEventListener("click", () => {
  window.history.back(); 
  // OR: window.location.href = "levels.html";
});

let celebrationAnimation = null;

function initCelebrationLottie() {
  if (celebrationAnimation) return;

  celebrationAnimation = lottie.loadAnimation({
    container: document.getElementById("lottieCelebration"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration2.json"
    // 🎈 You can replace this URL with your own Lottie JSON
  });
}

/* ================= NEXT ================= */
function nextLevel() {
  levelIndex++;

  if (levelIndex >= levels.length) {
    showCelebration();
    return;
  }

  initLevel();
}
function goBack() {
  window.location.href="fraction.html";
}


