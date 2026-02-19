const BASE_URL = "https://brightminds-backend-3.onrender.com";

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

let dragged = null;
let placedCount = 0;
const TOTAL_ITEMS = 6;

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

window.addEventListener("load", () => {
  const bgMusic = document.getElementById("bg-music");
  bgMusic.volume = 0.3;

  bgMusic.play().catch(() => {
    document.addEventListener("click", () => bgMusic.play(), { once: true });
  });
});

const allItems = [
  { name: "🧊 Ice", type: "solid" },
  { name: "🍎 Apple", type: "solid" },
  { name: "🪨 Stone", type: "solid" },
  { name: "📘 Book", type: "solid" },
  { name: "🪑 Chair", type: "solid" },
  { name: "🧱 Brick", type: "solid" },

  { name: "💧 Water", type: "liquid" },
  { name: "🥛 Milk", type: "liquid" },
  { name: "🛢️ Oil", type: "liquid" },
  { name: "🧃 Juice", type: "liquid" },
  { name: "☕ Tea", type: "liquid" },
  { name: "🍯 Honey", type: "liquid" },

  { name: "💨 Air", type: "gas" },
  { name: "🎈 Balloon", type: "gas" },
  { name: "🌬️ Wind", type: "gas" },
  { name: "💭 Smoke", type: "gas" },
  { name: "☁️ Cloud", type: "gas" },
  { name: "🧪 Gas", type: "gas" },
  { name: "🔥 Steam", type: "gas" },
  { name: "🫧 Vapor", type: "gas" }
];

const randomSix = [...allItems]
  .sort(() => 0.5 - Math.random())
  .slice(0, TOTAL_ITEMS);

const itemsContainer = document.querySelector(".items");

randomSix.forEach(obj => {
  const div = document.createElement("div");
  div.className = "item";
  div.draggable = true; // keep desktop drag
  div.dataset.type = obj.type;
  div.textContent = obj.name;
  itemsContainer.appendChild(div);
});

const items = document.querySelectorAll(".item");
const bins = document.querySelectorAll(".bin");

/* ---------------- DESKTOP DRAG ---------------- */

items.forEach(item => {
  item.addEventListener("dragstart", () => {
    dragged = item;
  });
});

bins.forEach(bin => {

  bin.addEventListener("dragover", e => e.preventDefault());

  bin.addEventListener("drop", () => {
    if (!dragged) return;
    handleDrop(dragged, bin);
    dragged = null;
  });

});

/* ---------------- MOBILE TOUCH DRAG ---------------- */
/* ---------------- MOBILE TOUCH DRAG ---------------- */

items.forEach(item => {

  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;
  let droppedSuccessfully = false;

  item.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    const rect = item.getBoundingClientRect();

    startX = rect.left;
    startY = rect.top;

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    item.style.position = "fixed";
    item.style.left = rect.left + "px";
    item.style.top = rect.top + "px";
    item.style.zIndex = "1000";

    droppedSuccessfully = false;
  });

  item.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];

    item.style.left = (touch.clientX - offsetX) + "px";
    item.style.top = (touch.clientY - offsetY) + "px";
  }, { passive: false });

  item.addEventListener("touchend", () => {

    const itemRect = item.getBoundingClientRect();

    bins.forEach(bin => {
      const binRect = bin.getBoundingClientRect();

      if (
        itemRect.left < binRect.right &&
        itemRect.right > binRect.left &&
        itemRect.top < binRect.bottom &&
        itemRect.bottom > binRect.top
      ) {
        handleDrop(item, bin);
        droppedSuccessfully = true;
      }
    });

    // ✅ If NOT dropped in bin → snap back
    if (!droppedSuccessfully) {
      item.style.position = "static";
      item.style.left = "";
      item.style.top = "";
      item.style.zIndex = "";
    }

  });

});


/* ---------------- SHARED DROP LOGIC ---------------- */
function handleDrop(item, bin) {

  const li = document.createElement("li");
  li.textContent = item.textContent;
  li.dataset.type = item.dataset.type;

  bin.querySelector(".list").appendChild(li);

  item.remove();
  placedCount++;

  // 🎯 When all items are placed → auto check
  if (placedCount === TOTAL_ITEMS) {
    setTimeout(evaluateGame, 500);
  }
}



/* ---------------- WIN + OTHER FUNCTIONS ---------------- */

function showWinMessage(score) {

  saveGameScore("ScienceSpotter-StatesOfMatter", score);

  document.getElementById("final-score").innerText =
    "Your Score: " + score + "/6";

  const overlay = document.getElementById("win-overlay");
  overlay.style.display = "flex";

  lottie.loadAnimation({
    container: document.getElementById("lottie-win"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration.json"
  });
}



function toggleLearn() {
  const overlay = document.getElementById("learn-overlay");
  overlay.style.display =
    overlay.style.display === "flex" ? "none" : "flex";
}

function goBack() {
  window.location.href = "topic.html";
}

document.getElementById("submit-btn").addEventListener("click", () => {

  if (placedCount !== TOTAL_ITEMS) {
    alert("Place all items before submitting!");
    return;
  }

  let score = TOTAL_ITEMS; // start from 6

  document.querySelectorAll(".bin").forEach(bin => {
    const binType = bin.dataset.type;

    bin.querySelectorAll("li").forEach(li => {

      if (li.dataset.type !== binType) {
        score--;
        li.style.color = "red";
      } else {
        li.style.color = "green";
      }

    });
  });

  showWinMessage(score);
});

function evaluateGame() {

  let score = TOTAL_ITEMS; // start full score

  document.querySelectorAll(".bin").forEach(bin => {
    const binType = bin.dataset.type;

    bin.querySelectorAll("li").forEach(li => {

      if (li.dataset.type !== binType) {
        score--;
        li.style.color = "red";
        document.getElementById("wrong-sound").play();
      } else {
        li.style.color = "green";
        document.getElementById("correct-sound").play();
      }

    });
  });

  setTimeout(() => {
    showWinMessage(score);
  }, 800);
}

