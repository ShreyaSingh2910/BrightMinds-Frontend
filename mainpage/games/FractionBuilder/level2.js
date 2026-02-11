const partsArea = document.getElementById("partsArea");
const filledSVG = document.getElementById("filledSVG");
const rightWhole = document.getElementById("rightWhole");
const rightFraction = document.getElementById("rightFraction");
const leftFractionText = document.getElementById("leftFraction");
const dropZone = document.getElementById("dropZone");
const checkBtn = document.getElementById("checkBtn");
const resultMsg = document.getElementById("resultMsg");
const celebration = document.getElementById("celebration");
const replayBtn = document.getElementById("replayBtn");
const backBtn = document.getElementById("backBtn");

const bgMusic = document.getElementById("bgMusic");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

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


let celebrationAnimation = null;

function saveGameScore(gameName, score) {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  fetch("http://localhost:8080/api/game/saveScore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      gameName: gameName,
      score: score
    })
  }).catch(err => console.error("Score save failed", err));
}


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
  return [...all].sort(() => Math.random() - 0.5).slice(0, count);
}

const levels = pickRandomLevels(All_levels, 5);


let levelIndex = 0;
let activePart = null;
let occupiedSlices = new Set();
initLevel();

function initLevel() {
  activePart = null;
  occupiedSlices.clear();
  partsArea.innerHTML = "";
  filledSVG.innerHTML = "";
  rightWhole.innerHTML = "";
  resultMsg.textContent = "";

  const current = levels[levelIndex];

  leftFractionText.textContent = `${current.left.n} / ${current.left.d}`;

  drawLeftCircle(current.left.n, current.left.d);
  drawRightCircle(current.right.d);
  buildParts(current.right.d);
  updateRightFraction();
}

function drawLeftCircle(n, d) {
  const svg = document.querySelector(".side svg");
  svg.innerHTML = "";

  const sliceAngle = 360 / d;

  for (let i = 0; i < n; i++) {
    const a1 = i * sliceAngle * Math.PI / 180;
    const a2 = (i + 1) * sliceAngle * Math.PI / 180;
    svg.appendChild(makeSlice(a1, a2, "#009688"));
  }

  svg.appendChild(makeOutline());
}

function drawRightCircle(d) {
  rightWhole.appendChild(makeOutline());

  for (let i = 0; i < d; i++) {
    const a = (360 / d) * i * Math.PI / 180;
    rightWhole.appendChild(svgLine(a));
  }
}

function buildParts(count) {
  for (let i = 0; i < count; i++) {
    const part = document.createElement("div");
    part.className = "part";
    part.draggable = true;

    part.addEventListener("dragstart", () => {
      activePart = part;
    });

    partsArea.appendChild(part);
  }
}

dropZone.addEventListener("dragover", e => e.preventDefault());

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  if (!activePart || activePart.classList.contains("used")) return;

  const rect = dropZone.getBoundingClientRect();
  const x = e.clientX - rect.left - 100;
  const y = e.clientY - rect.top - 100;


  if (Math.hypot(x, y) > 100) return;

  let angle = Math.atan2(y, x) * 180 / Math.PI;
  if (angle < 0) angle += 360;

  const d = levels[levelIndex].right.d;
  const sliceAngle = 360 / d;
  const sliceIndex = Math.floor(angle / sliceAngle);

  if (occupiedSlices.has(sliceIndex)) return;

  occupiedSlices.add(sliceIndex);
  activePart.classList.add("used");

  redrawFilledSlices();
  updateRightFraction();
});

function redrawFilledSlices() {
  filledSVG.innerHTML = "";
  const d = levels[levelIndex].right.d;
  const sliceAngle = 360 / d;

  occupiedSlices.forEach(i => {
    const a1 = i * sliceAngle * Math.PI / 180;
    const a2 = (i + 1) * sliceAngle * Math.PI / 180;

    const slice = makeSlice(a1, a2, "#009688");
    slice.style.cursor = "pointer";

    slice.addEventListener("click", () => {
      occupiedSlices.delete(i);
      redrawFilledSlices();
      updateRightFraction();

      const used = document.querySelector(".part.used");
      used && used.classList.remove("used");
    });

    filledSVG.appendChild(slice);
  });
}

function updateRightFraction() {
  const d = levels[levelIndex].right.d;
  rightFraction.textContent =
    occupiedSlices.size === 0
      ? `? / ${d}`
      : `${occupiedSlices.size} / ${d}`;
}

checkBtn.addEventListener("click", () => {
  const current = levels[levelIndex];

  if (occupiedSlices.size === current.right.n) {
    correctSound && correctSound.play();
    resultMsg.textContent =
      `${current.left.n}/${current.left.d} = ${current.right.n}/${current.right.d}`;
    resultMsg.style.color = "green";
    setTimeout(nextLevel, 1500);
  } else {
    wrongSound && wrongSound.play();
    resultMsg.textContent = "Try adjusting the pieces 😊";
    resultMsg.style.color = "orange";
  }
});

function nextLevel() {
  levelIndex++;

  if (levelIndex >= levels.length) {
    saveGameScore("FractionBuilder-level2", 5);
    showCelebration();
    return;
  }

  initLevel();
}

function makeSlice(a1, a2, color) {
  return svg("path", {
    d: `M100 100
        L${100 + 100*Math.cos(a1)} ${100 + 100*Math.sin(a1)}
        A100 100 0 0 1 ${100 + 100*Math.cos(a2)} ${100 + 100*Math.sin(a2)}
        Z`,
    fill: color
  });
}

function makeOutline() {
  return svg("circle", {
    cx: 100, cy: 100, r: 98,
    fill: "none", stroke: "#555", "stroke-width": 2
  });
}

function svgLine(a) {
  return svg("line", {
    x1: 100, y1: 100,
    x2: 100 + 100 * Math.cos(a),
    y2: 100 + 100 * Math.sin(a),
    stroke: "#555"
  });
}

function svg(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function goBack() {
  window.location.href = "fraction.html";
}

function showCelebration() {
  celebration.classList.remove("hidden");

  if (!celebrationAnimation) {
    celebrationAnimation = lottie.loadAnimation({
      container: document.getElementById("lottieCelebration"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "lottie/celebration2.json"
    });
  }
}
function nextLevel() {
  levelIndex++;

  if (levelIndex >= levels.length) {
    showCelebration();
    return;
  }

  initLevel();
}
replayBtn.addEventListener("click", () => {
  celebration.classList.add("hidden");
  levelIndex = 0;
  placedIndexes = [];
  initLevel();
});
backBtn.addEventListener("click", () => {
  window.history.back();
   window.location.href = "fraction.html";

});
