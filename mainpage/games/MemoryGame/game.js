const allLetters = [
  { img: "A.jpg", match: "apple.jpg" }, { img: "B.jpg", match: "Baloon.jpg" },
  { img: "C.jpg", match: "cake.png" }, { img: "D.jpg", match: "dolphine.png" },
  { img: "E.jpg", match: "elephant.jpg" }, { img: "F.jpg", match: "fox.avif" },
  { img: "G.jpg", match: "giraffe.webp" }, { img: "H.jpg", match: "home.avif" },
  { img: "I.jpg", match: "icecream.avif" }, { img: "J.jpg", match: "jelly_fish.avif" },
  { img: "K.jpg", match: "kite.avif" }, { img: "L.jpg", match: "lemon.avif" },
  { img: "M.jpg", match: "monkey.avif" }, { img: "N.jpg", match: "nest.png" },
  { img: "O.jpg", match: "owl.jpg" }, { img: "P.jpg", match: "pizza.avif" },
  { img: "Q.jpg", match: "queen.avif" }, { img: "R.jpg", match: "Rabbit.jpg" },
  { img: "S.jpg", match: "strawberry.png" }, { img: "T.jpg", match: "turtle.avif" },
  { img: "U.jpg", match: "unicorn.avif" }, { img: "V.jpg", match: "vase.avif" },
  { img: "W.jpg", match: "window.avif" }, { img: "X.jpg", match: "xmas.png" },
  { img: "Y.jpg", match: "yacht.jpg" }, { img: "Z.jpg", match: "zebra.avif" }
];
window.addEventListener("load", () => {
  const music = document.getElementById("bg-music");
  if (!music) return;

  music.volume = 0.3;
  music.play().catch(() => {
    document.addEventListener("click", () => {
      music.play();
    }, { once: true });
  });
});

// Database Sync
async function syncScoreToDb(scoreValue) {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    try {
        await fetch("http://localhost:8080/api/game/saveScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, gameName: "memoryGame", score: scoreValue })
        });
    } catch (e) { console.error("DB Sync Error", e); }
}

function getRandomCards() {
  const selected = [...allLetters].sort(() => 0.5 - Math.random()).slice(0, 8);
  let cards = [];
  selected.forEach((item, index) => {
    cards.push({ pair: index, img: item.img });
    cards.push({ pair: index, img: item.match });
  });
  return cards.sort(() => 0.5 - Math.random());
}

const cardsData = getRandomCards();
const grid = document.getElementById("grid");
let firstCard = null, secondCard = null, lockBoard = false, matchedPairs = 0;

// Render Grid
cardsData.forEach(item => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.pair = item.pair;
  card.innerHTML = `<div class="card-inner">
    <div class="back"></div>
    <div class="front"><img src="assets/${item.img}"></div>
  </div>`;
  card.addEventListener("click", () => flipCard(card));
  grid.appendChild(card);
});

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;
  card.classList.add("flip");
  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("match-join");
  secondCard.classList.add("match-join");

  setTimeout(() => {
    firstCard.classList.replace("match-join", "match-exit");
    secondCard.classList.replace("match-join", "match-exit");
  }, 900);

  setTimeout(() => {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";
    matchedPairs++;
    if (matchedPairs === cardsData.length / 2) showWinMessage();
    resetBoard();
  }, 2600);
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 900);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function showWinMessage() {
  document.getElementById("win-overlay").style.display = "flex";
  syncScoreToDb(10);
  lottie.loadAnimation({
    container: document.getElementById("lottie-win"),
    renderer: "svg", loop: true, autoplay: true,
    path: "lottie/celebration.json"
  });
}