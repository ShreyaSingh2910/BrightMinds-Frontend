const BASE_URL = "https://brightminds-backend-3.onrender.com";
const levels = {
  easy: {
    count: 4,
    categories: [
      "seasonClothes",
      "objectColor",
      "occupationTools",
      "bodyFunction"
    ]
  },
  medium: {
    count: 5,
    categories: [
      "stateFood",
      "stateFestival",
      "stateCapital",
      "stateLanguage"
    ]
  },
  hard: {
    count: 7,
    categories: [
      "countryCapital",
      "countryCurrency",
      "countryMonument",
      "countryContinent"
    ]
  }
};
let currentCategoryKey = ""; // Global variable to track the current game type
const gameData = {
  seasonClothes: {
    left: "Season",
    right: "Clothes",
    data: {
      Winter: "Jacket",
      Summer: "T-shirt",
      Rainy: "Raincoat",
      Spring: "Light Shirt",
      Autumn: "Sweater",
      Snow: "Coat",
      Hot: "Cap",
      Cold: "Woolen",
      Foggy: "Hoodie",
      Windy: "Jacket"
    }
  },

  objectColor: {
    left: "Object",
    right: "Color",
    data: {
      Apple: "Red",
      Banana: "Yellow",
      Sky: "Blue",
      Grass: "Green",
      Milk: "White",
      Coal: "Black",
      Rose: "Pink",
      Sun: "Yellow",
      Cloud: "White",
      Orange: "Orange"
    }
  },

  occupationTools: {
    left: "Occupation",
    right: "Tool",
    data: {
      Doctor: "Stethoscope",
      Farmer: "Plough",
      Teacher: "Book",
      Carpenter: "Hammer",
      Painter: "Brush",
      Chef: "Pan",
      Tailor: "Needle",
      Driver: "Steering",
      Barber: "Scissors",
      Electrician: "Tester"
    }
  },

  bodyFunction: {
    left: "Body Part",
    right: "Function",
    data: {
      Heart: "Pump blood",
      Eyes: "See",
      Ears: "Hear",
      Legs: "Walk",
      Hands: "Hold",
      Nose: "Smell",
      Brain: "Think",
      Lungs: "Breathe",
      Teeth: "Chew",
      Tongue: "Taste"
    }
  },

  stateFood: {
    left: "State",
    right: "Food",
    data: {
      Gujarat: "Dhokla",
      Punjab: "Makki di Roti",
      Rajasthan: "Dal Baati",
      TamilNadu: "Idli",
      Maharashtra: "Vada Pav",
      Kerala: "Sadya",
      Assam: "Masor Tenga",
      Bihar: "Litti Chokha",
      Telangana: "Biryani",
      Odisha: "Pakhala"
    }
  },

  stateFestival: {
    left: "State",
    right: "Festival",
    data: {
      Gujarat: "Navratri",
      Kerala: "Onam",
      Punjab: "Baisakhi",
      Bengal: "Durga Puja",
      Maharashtra: "Ganesh Chaturthi",
      Assam: "Bihu",
      Rajasthan: "Teej",
      TamilNadu: "Pongal",
      Odisha: "Rath Yatra",
      Karnataka: "Dasara"
    }
  },

  stateCapital: {
    left: "State",
    right: "Capital",
    data: {
      Gujarat: "Gandhinagar",
      Maharashtra: "Mumbai",
      Rajasthan: "Jaipur",
      TamilNadu: "Chennai",
      Kerala: "Thiruvananthapuram",
      Punjab: "Chandigarh",
      Assam: "Dispur",
      Odisha: "Bhubaneswar",
      Karnataka: "Bengaluru",
      Bihar: "Patna"
    }
  },

  stateLanguage: {
    left: "State",
    right: "Language",
    data: {
      Gujarat: "Gujarati",
      Punjab: "Punjabi",
      TamilNadu: "Tamil",
      Bengal: "Bengali",
      Maharashtra: "Marathi",
      Kerala: "Malayalam",
      Assam: "Assamese",
      Odisha: "Odia",
      Karnataka: "Kannada",
      Telangana: "Telugu"
    }
  },

  countryCapital: {
    left: "Country",
    right: "Capital",
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
      Brazil: "Brasilia"
    }
  },

  countryCurrency: {
    left: "Country",
    right: "Currency",
    data: {
      India: "Rupee",
      USA: "Dollar",
      UK: "Pound",
      Japan: "Yen",
      China: "Yuan",
      Germany: "Euro",
      France: "Euro",
      Russia: "Ruble",
      Brazil: "Real",
      Australia: "Dollar"
    }
  },

  countryMonument: {
    left: "Country",
    right: "Monument",
    data: {
      India: "Taj Mahal",
      France: "Eiffel Tower",
      China: "Great Wall",
      Egypt: "Pyramids",
      USA: "Statue of Liberty",
      Brazil: "Christ Redeemer",
      Italy: "Colosseum",
      Australia: "Opera House",
      Spain: "Sagrada Familia",
      UK: "Big Ben"
    }
  },

  countryContinent: {
    left: "Country",
    right: "Continent",
    data: {
      India: "Asia",
      France: "Europe",
      Brazil: "South America",
      USA: "North America",
      Australia: "Australia",
      Egypt: "Africa",
      Japan: "Asia",
      Germany: "Europe",
      Canada: "North America",
      Argentina: "South America"
    }
  }
};

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

correctSound.volume = 0.6;
wrongSound.volume = 0.6;

let audioUnlocked = false;

function selectLevel(level) {
  currentLevel = level;

  levelMenu.style.display = "none";
  categoryMenu.style.display = "block";
  gameArea.style.display = "none";
  backWrapper.style.display = "block";

  document.getElementById("levelHint").style.display = "none";
  document.getElementById("categoryHint").style.display = "flex";

  categoryMenu.innerHTML = "";

  levels[level].categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = gameData[cat].left + " → " + gameData[cat].right;
    btn.onclick = () => loadGame(cat);
    categoryMenu.appendChild(btn);
  });
}

async function syncScoreToDb() {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) return;

  // Merge Category and Level into one string
  const combinedGameName = `MatchCity-${currentLevel}`;

  const payload = {
    email: userEmail,
    gameName: combinedGameName, // Now sends "stateFood-easy"
    score: score
    // Notice: no 'level' field sent here
  };

  try {
    await fetch(`${BASE_URL}/api/game/saveScore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(`✅ Saved for ${combinedGameName}`);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

function unlockAudioOnce() {
  if (audioUnlocked) return;

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

document.addEventListener("click", unlockAudioOnce, { once: true });


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

let currentLevel = null;
let selectedLeft = null;
let score = 0;
let currentGame = {};

const levelMenu = document.getElementById("levelMenu");
const categoryMenu = document.getElementById("categoryMenu");
const gameArea = document.getElementById("gameArea");
const backWrapper = document.getElementById("backWrapper");

const leftDiv = document.getElementById("states");
const rightDiv = document.getElementById("options");
const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");
const scoreText = document.getElementById("score");

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getSubset(obj, count) {
  const keys = shuffle(Object.keys(obj)).slice(0, count);
  const res = {};
  keys.forEach(k => res[k] = obj[k]);
  return res;
}


function loadGame(type) {
currentCategoryKey = type; // Store the type (e.g., 'stateFood', 'countryCapital')

  document.getElementById("categoryHint").style.display = "none";

  gameArea.style.display = "flex";
  score = 0;
  scoreText.innerText = "Score: 0 ⭐";

  const cfg = levels[currentLevel];
  const full = gameData[type];
  const selected = getSubset(full.data, cfg.count);

  currentGame = { ...full, data: selected };

  leftTitle.innerText = currentGame.left;
  rightTitle.innerText = currentGame.right;

  leftDiv.innerHTML = "";
  rightDiv.innerHTML = "";
  selectedLeft = null;

  Object.keys(selected).forEach(k => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerText = k;
    d.onclick = () => {
      document.querySelectorAll("#states .item")
        .forEach(i => i.classList.remove("selected"));
      d.classList.add("selected");
      selectedLeft = k;
    };
    leftDiv.appendChild(d);
  });

  shuffle(Object.values(selected)).forEach(v => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerText = v;
    d.onclick = () => checkAnswer(d, v);
    rightDiv.appendChild(d);
  });
}

function checkAnswer(div, value) {
  if (!selectedLeft) return;

  const leftItem = [...leftDiv.children].find(i => i.innerText === selectedLeft);

  if (currentGame.data[selectedLeft] === value) {
    leftItem.style.pointerEvents = "none";
    div.style.pointerEvents = "none";

    leftItem.classList.add("highfive-left");
    div.classList.add("highfive-right");

    setTimeout(() => {
      leftItem.classList.add("highfive-hold");
      div.classList.add("highfive-hold");
    }, 600);

    setTimeout(() => {
      leftItem.classList.remove("highfive-left","highfive-hold");
      div.classList.remove("highfive-right","highfive-hold");
      leftItem.classList.add("correct","highfive-bounce");
      div.classList.add("correct","highfive-bounce");

      score++;
      scoreText.innerText = `Score: ${score} ⭐`;
       if (score === levels[currentLevel].count) {
               syncScoreToDb();
           }
      correctSound.currentTime = 0;
      correctSound.play().catch(()=>{});
      confettiAnim.goToAndPlay(0,true);
      leftAnim.goToAndPlay(0,true);
      rightAnim.goToAndPlay(0,true);
    }, 1000);

    selectedLeft = null;
  } else {
    div.classList.add("wrong");
    wrongSound.currentTime = 0;
    wrongSound.play().catch(()=>{});
    setTimeout(()=>div.classList.remove("wrong"),600);
  }
}

function goBack() {
  selectedLeft = null;
  score = 0;
  scoreText.innerText = "Score: 0 ⭐";

  leftDiv.innerHTML = "";
  rightDiv.innerHTML = "";

  gameArea.style.display = "none";
  categoryMenu.style.display = "none";
  backWrapper.style.display = "none";

  levelMenu.style.display = "block";
  document.getElementById("categoryHint").style.display = "none";
  document.getElementById("levelHint").style.display = "flex";
}

const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.25;

let bgStarted = false;

function startBackgroundMusic() {
  if (bgStarted) return;

  bgMusic.play().then(() => {
    bgStarted = true;
    console.log("🎵 Background music started");
  }).catch(() => {

  });
}

document.addEventListener("click", () => {
  startBackgroundMusic();
}, { once: true });

async function fetchAllProgress(email) {
  const response = await fetch(`${BASE_URL}/api/game/scores?email=${email}`);
  const allScores = await response.json();
  // This returns: { "seasonClothes": 4, "stateFood": 5, ... }
  console.log("Player Progress:", allScores);

}

function goBack() {
  window.location.href = "../../index.html";
}

