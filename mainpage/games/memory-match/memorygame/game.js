// =======================
// LETTER ↔ IMAGE PAIRS
// =======================
const cardsData = [
  { pair: 1, img: "A.jpg" },
  { pair: 1, img: "apple.jpg" },

  { pair: 2, img: "D.avif" },
  { pair: 2, img: "dolphine.png" },

  { pair: 3, img: "H.webp" },
  { pair: 3, img: "home.avif" },

  { pair: 4, img: "K.webp" },
  { pair: 4, img: "kite.avif" },

  { pair: 5, img: "P.webp" },
  { pair: 5, img: "pizza.avif" },

  { pair: 6, img: "R.webp" },
  { pair: 6, img: "Rabbit.jpg" },

  { pair: 7, img: "U.png" },
  { pair: 7, img: "unicorn.avif" },

  { pair: 8, img: "Z.png" },
  { pair: 8, img: "zebra.avif" }
];

window.addEventListener('load', () => {
  const music = document.getElementById("bg-music");
  music.volume = 0.3; // Keeps it soft
  music.play().catch(error => {
    // If the browser still blocks it, play it on the first card click
    console.log("Waiting for user interaction to play music...");
    document.addEventListener('click', () => {
      music.play();
    }, { once: true });
  });
});

// Shuffle cards
cardsData.sort(() => 0.5 - Math.random());

const grid = document.getElementById("grid");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

// =======================
// CREATE CARD ELEMENTS
// =======================
cardsData.forEach(item => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.pair = item.pair;

  card.innerHTML = `
    <div class="card-inner">
      <div class="back"></div>
      <div class="front">
        <img src="assets/${item.img}">
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("matched")) return;

    card.classList.add("flip");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lockBoard = true;
      checkMatch();
    }
  });

  grid.appendChild(card);
});



// =======================  
let matchedPairs = 0;
const totalPairs = cardsData.length / 2;

function checkMatch() {

  if (firstCard.dataset.pair === secondCard.dataset.pair) {

    lockBoard = true;

    // STEP 1: Move both cards to center
    firstCard.classList.add("match-join");
    secondCard.classList.add("match-join");

    // STEP 2: Pause slightly, then move down-left
    setTimeout(() => {
      firstCard.classList.remove("match-join");
      secondCard.classList.remove("match-join");

      firstCard.classList.add("match-exit");
      secondCard.classList.add("match-exit");
    }, 900); // slow pause at center

    // STEP 3: Remove after animation
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      firstCard.style.visibility = "hidden";
      secondCard.style.visibility = "hidden";

      matchedPairs++;

      if (matchedPairs === totalPairs) {
        setTimeout(showWinMessage, 800);
      }

      resetBoard();
    }, 2600); // total animation time

  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 900);
  }
}



function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false; // THIS IS THE KEY: It must be false for the next click
}

function showWinMessage() {
  document.getElementById("win-overlay").style.display = "flex";
  
  // Optional: Add a celebratory Lottie animation
  lottie.loadAnimation({
    container: document.getElementById("lottie-win"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration.json" // Make sure you have a celebration JSON!
  });
}