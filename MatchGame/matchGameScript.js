// ================= GAME DATA =================
const gameData = {
  indiaCapital: {
    left: "States",
    right: "Capitals",
    data: {
      Gujarat: "Gandhinagar",
      Maharashtra: "Mumbai",
      Rajasthan: "Jaipur",
      "Tamil Nadu": "Chennai"
    }
  },
  indiaFood: {
    left: "States",
    right: "Food",
    data: {
      Gujarat: "Dhokla",
      Punjab: "Makki di Roti",
      "Tamil Nadu": "Idli",
      Rajasthan: "Dal Baati"
    }
  },
  indiaFestival: {
    left: "States",
    right: "Festivals",
    data: {
      Gujarat: "Navratri",
      Kerala: "Onam",
      Punjab: "Baisakhi",
      "West Bengal": "Durga Puja"
    }
  },
  indiaLanguage: {
    left: "States",
    right: "Languages",
    data: {
      Gujarat: "Gujarati",
      Punjab: "Punjabi",
      "Tamil Nadu": "Tamil",
      "West Bengal": "Bengali"
    }
  },
  worldCapital: {
    left: "Countries",
    right: "Capitals",
    data: {
      India: "New Delhi",
      France: "Paris",
      Japan: "Tokyo",
      USA: "Washington DC"
    }
  },
  worldMonument: {
    left: "Countries",
    right: "Monuments",
    data: {
      India: "Taj Mahal",
      France: "Eiffel Tower",
      China: "Great Wall",
      Egypt: "Pyramids"
    }
  }
};

// ================= VARIABLES =================
let selectedLeft = null;
let score = 0;
let currentGame = {};

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

correctSound.volume = 0.6;
wrongSound.volume = 0.6;



// 🔓 AUDIO UNLOCK (MANDATORY)
let audioUnlocked = false;
document.body.addEventListener("click", () => {
  if (!audioUnlocked) {
    correctSound.play().then(() => {
      correctSound.pause();
      correctSound.currentTime = 0;
    }).catch(() => {});

    wrongSound.play().then(() => {
      wrongSound.pause();
      wrongSound.currentTime = 0;
    }).catch(() => {});

    audioUnlocked = true;
    console.log("🔊 Audio unlocked");
  }
}, { once: true });

// ================= DOM =================
const leftDiv = document.getElementById("states");
const rightDiv = document.getElementById("options");
const message = document.getElementById("message");
const scoreText = document.getElementById("score");
const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");

// ================= GAME FUNCTIONS =================
function loadGame(type) {
  leftDiv.innerHTML = "";
  rightDiv.innerHTML = "";
  selectedLeft = null;
  score = 0;

  scoreText.innerText = "Score: 0 ⭐";
  message.innerText = "Now choose the correct match 😊";

  currentGame = gameData[type];
  leftTitle.innerText = currentGame.left;
  rightTitle.innerText = currentGame.right;

  Object.keys(currentGame.data).forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerText = item;
    div.onclick = () => selectLeft(div, item);
    leftDiv.appendChild(div);
  });

  shuffle(Object.values(currentGame.data)).forEach(option => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerText = option;
    div.onclick = () => checkAnswer(div, option);
    rightDiv.appendChild(div);
  });
}

function selectLeft(div, value) {
  clearSelection();
  div.classList.add("selected");
  selectedLeft = value;
}

function checkAnswer(div, value) {
  if (!selectedLeft) {
    message.innerText = "Pick one from the left first!";
    return;
  }

  // ✅ CORRECT
  if (currentGame.data[selectedLeft] === value) {
    div.classList.add("correct");
    div.style.pointerEvents = "none";

    document.querySelectorAll("#states .item").forEach(i => {
      if (i.innerText === selectedLeft) {
        i.classList.add("correct");
        i.style.pointerEvents = "none";
      }
    });

    message.innerText = "🎉 Correct!";
    score++;
    scoreText.innerText = `Score: ${score} ⭐`;

    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});

    // 🎊 Confetti
    confettiAnim.stop();
    confettiAnim.goToAndPlay(0, true);

    // 🐦 Side animations
    leftAnim.setSpeed(1.4);
    leftAnim.goToAndPlay(0, true);

    rightAnim.setSpeed(1.4);
    rightAnim.goToAndPlay(0, true);

    selectedLeft = null;
  } 
  // ❌ WRONG
  else {
    div.classList.add("wrong");
    message.innerText = "❌ Try again!";

    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});

    setTimeout(() => {
      div.classList.remove("wrong");
    }, 600);
  }

  clearSelection();
}

 


function clearSelection() {
  document.querySelectorAll("#states .item").forEach(i =>
    i.classList.remove("selected")
  );
}


function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ================= LOTTIE =================
const leftAnim = lottie.loadAnimation({
  container: document.getElementById("leftLottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie/flying bird.json"
});

const rightAnim = lottie.loadAnimation({
  container: document.getElementById("rightLottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie/party_dance.json"
});

const confettiAnim = lottie.loadAnimation({
  container: document.getElementById("confettiLottie"),
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "./lottie/success.json"
});