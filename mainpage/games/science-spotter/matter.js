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
  div.draggable = true;
  div.dataset.type = obj.type;
  div.textContent = obj.name;
  itemsContainer.appendChild(div);
});

document.querySelectorAll(".item").forEach(item => {
  item.addEventListener("dragstart", () => {
    dragged = item;
  });
});

document.querySelectorAll(".bin").forEach(bin => {

  bin.addEventListener("dragover", e => e.preventDefault());

  bin.addEventListener("drop", () => {
    if (!dragged) return;

    const binType = bin.dataset.type;

    if (dragged.dataset.type === binType) {

      correctSound.currentTime = 0;
correctSound.play();

      const li = document.createElement("li");
      li.textContent = dragged.textContent;
      bin.querySelector(".list").appendChild(li);

      bin.classList.add("hit");
      setTimeout(() => bin.classList.remove("hit"), 400);

      dragged.remove();
      placedCount++;        
      if (placedCount === TOTAL_ITEMS) {
        setTimeout(showWinMessage, 600);
      }
    } 
    else {
      wrongSound.currentTime = 0;
wrongSound.play();

      dragged.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 300 }
      );
    }

    dragged = null;
  });
});
function showWinMessage() {
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

