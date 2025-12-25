  const gameData = {
  indiaCapital: {
    left: "States",
    right: "Capitals",
    data: {
      Gujarat: "Gandhinagar",
      Maharashtra: "Mumbai",
      Rajasthan: "Jaipur",
      "Tamil Nadu": "Chennai",
      Kerala: "Thiruvananthapuram",
      Punjab: "Chandigarh",
      Bihar: "Patna",
      Odisha: "Bhubaneswar",
      Assam: "Dispur",
      Karnataka: "Bengaluru"
    }
  },

  indiaFood: {
    left: "States",
    right: "Food",
    data: {
      Gujarat: "Dhokla",
      Punjab: "Makki di Roti",
      Rajasthan: "Dal Baati",
      "Tamil Nadu": "Idli",
      Maharashtra: "Vada Pav",
      Kerala: "Sadya",
      Bihar: "Litti Chokha",
      Assam: "Masor Tenga",
      "Jammu and kashmir": "Rogan Josh",
      Telangana: "Hyderabadi Biryani"
    }
  },

  indiaFestival: {
    left: "States",
    right: "Festivals",
    data: {
      Gujarat: "Navratri",
      Kerala: "Onam",
      Punjab: "Baisakhi",
      "West Bengal": "Durga Puja",
      Maharashtra: "Ganesh Chaturthi",
      Assam: "Bihu",
      Rajasthan: "Teej",
      TamilNadu: "Pongal",
      Odisha: "Rath Yatra",
      Karnataka: "Mysore Dasara"
    }
  },

  indiaLanguage: {
    left: "States",
    right: "Languages",
    data: {
      Gujarat: "Gujarati",
      Punjab: "Punjabi",
      "Tamil Nadu": "Tamil",
      "West Bengal": "Bengali",
      Maharashtra: "Marathi",
      Kerala: "Malayalam",
      Assam: "Assamese",
      Odisha: "Odia",
      Karnataka: "Kannada",
      Telangana: "Telugu"
    }
  },

  worldCapital: {
    left: "Countries",
    right: "Capitals",
    data: {
      India: "New Delhi",
      France: "Paris",
      Japan: "Tokyo",
      USA: "Washington DC",
      UK: "London",
      Germany: "Berlin",
      Italy: "Rome",
      Canada: "Ottawa",
      Australia: "Canberra",
      Brazil: "Brasília"
    }
  },

  worldMonument: {
    left: "Countries",
    right: "Monuments",
    data: {
      India: "Taj Mahal",
      France: "Eiffel Tower",
      China: "Great Wall",
      Egypt: "Pyramids",
      Italy: "Tower of Pisa",
      USA: "Statue of Liberty",
      Brazil: "Christ the Redeemer",
      Australia: "Opera House",
      London: "Buckingham Palace",
      Spain: "Sagrada Familia"
    }
  }
};

let selectedLeft = null;
let score = 0;
let currentGame = {};

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

correctSound.volume = 0.6;
wrongSound.volume = 0.6;

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
  }
}, { once: true });


const leftDiv = document.getElementById("states");
const rightDiv = document.getElementById("options");
const message = document.getElementById("message");
const scoreText = document.getElementById("score");
const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");
const gameArea = document.querySelector(".game-area");
const startHint = document.getElementById("startHint");




function getRandomSubset(obj, count) {
  const keys = Object.keys(obj)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  const subset = {};
  keys.forEach(k => subset[k] = obj[k]);
  return subset;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function clearSelection() {
  document.querySelectorAll("#states .item")
    .forEach(i => i.classList.remove("selected"));
}


function loadGame(type) {
  

  // ✅ SHOW GAME, HIDE HINT
  gameArea.style.display = "flex";
  startHint.style.display = "none";

  leftDiv.innerHTML = "";
  rightDiv.innerHTML = "";
  selectedLeft = null;
  score = 0;

  scoreText.innerText = "Score: 0 ⭐";
  message.innerText = "Now choose the correct match 😊";

  const fullGame = gameData[type];


  
  const selectedData = getRandomSubset(fullGame.data, 4);

  currentGame = {
    left: fullGame.left,
    right: fullGame.right,
    data: selectedData
  };

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

  const leftItem = [...document.querySelectorAll("#states .item")]
    .find(i => i.innerText === selectedLeft);

  // ✅ CORRECT
  if (currentGame.data[selectedLeft] === value) {

    // LOCK INPUT
    leftItem.style.pointerEvents = "none";
    div.style.pointerEvents = "none";

    // STEP 1: MOVE TO CENTER
    leftItem.classList.add("highfive-left");
    div.classList.add("highfive-right");

    // STEP 2: HOLD + GLOW (HIGH FIVE MOMENT)
    setTimeout(() => {
      leftItem.classList.add("highfive-hold");
      div.classList.add("highfive-hold");
    }, 600);

    // STEP 3: BOUNCE + SUCCESS
    setTimeout(() => {
      leftItem.classList.remove("highfive-left", "highfive-hold");
      div.classList.remove("highfive-right", "highfive-hold");

      leftItem.classList.add("correct", "highfive-bounce");
      div.classList.add("correct", "highfive-bounce");

      // SCORE
      score++;
      scoreText.innerText = `Score: ${score} ⭐`;
      message.innerText = "🎉 Awesome Match!";

      // SOUND
      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});

      // CONFETTI + SIDE ANIM
      confettiAnim.goToAndPlay(0, true);
      leftAnim.goToAndPlay(0, true);
      rightAnim.goToAndPlay(0, true);

      // CLEANUP BOUNCE
      setTimeout(() => {
        leftItem.classList.remove("highfive-bounce");
        div.classList.remove("highfive-bounce");
      }, 400);

    }, 1000);

    selectedLeft = null;
  }

  // ❌ WRONG
  else {
    div.classList.add("wrong");
    message.innerText = "❌ Try again!";
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});

    setTimeout(() => div.classList.remove("wrong"), 600);
  }

  clearSelection();
}



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
