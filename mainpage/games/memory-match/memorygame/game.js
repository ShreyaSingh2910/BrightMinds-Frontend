
const allLetters = [
  { img: "A.jpg", match: "apple.jpg" },
  { img: "B.jpg", match: "Baloon.jpg" },
  { img: "C.jpg", match: "cake.png" },
  { img: "D.jpg", match: "dolphine.png" },
  { img: "E.jpg", match: "elephant.jpg" },
  { img: "F.jpg", match: "fox.avif" },
  { img: "G.jpg", match: "giraffe.webp" },
  { img: "H.jpg", match: "home.avif" },
  { img: "I.jpg", match: "icecream.avif" },
  { img: "J.jpg", match: "jelly_fish.avif" },
  { img: "K.jpg", match: "kite.avif" },
  { img: "L.jpg", match: "lemon.avif" },
  { img: "M.jpg", match: "monkey.avif" },
  { img: "N.jpg", match: "nest.png" },
  { img: "O.jpg", match: "owl.jpg" },
  { img: "P.jpg", match: "pizza.avif" },
  { img: "Q.jpg", match: "queen.avif" },
  { img: "R.jpg", match: "Rabbit.jpg" },
  { img: "S.jpg", match: "strawberry.png" },
  { img: "T.jpg", match: "turtle.avif" },
  { img: "U.jpg", match: "unicorn.avif" },
  { img: "V.jpg", match: "vase.avif" },
  { img: "W.jpg", match: "window.avif" },
  { img: "X.jpg", match: "xmas.png" },
  { img: "Y.jpg", match: "yacht.jpg" },
  { img: "Z.jpg", match: "zebra.avif" }
];

function getRandomCards() {
  const shuffled = [...allLetters].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 8);

  let cards = [];
  let pairId = 1;

  selected.forEach(item => {
    cards.push({ pair: pairId, img: item.img });
    cards.push({ pair: pairId, img: item.match });
    pairId++;
  });

  return cards;
}

const cardsData = getRandomCards();
cardsData.sort(() => 0.5 - Math.random());

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


const grid = document.getElementById("grid");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = cardsData.length / 2;

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


function checkMatch() {

  if (firstCard.dataset.pair === secondCard.dataset.pair) {


    firstCard.classList.add("match-join");
    secondCard.classList.add("match-join");

    setTimeout(() => {
      firstCard.classList.remove("match-join");
      secondCard.classList.remove("match-join");

      firstCard.classList.add("match-exit");
      secondCard.classList.add("match-exit");
    }, 900);


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
    }, 2600);

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
  lockBoard = false;
}


function showWinMessage() {
  document.getElementById("win-overlay").style.display = "flex";

  lottie.loadAnimation({
    container: document.getElementById("lottie-win"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "lottie/celebration.json"
  });
}

