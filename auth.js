/*********************************
 🔥 FIREBASE CONFIG
**********************************/
const firebaseConfig = {
  apiKey: "AIzaSyBmz23pK8TQ8iE5_EjRbOo0qCazLOBmcBw",
  authDomain: "brightminds-52de2.firebaseapp.com",
  projectId: "brightminds-52de2",
  storageBucket: "brightminds-52de2.appspot.com",
  messagingSenderId: "855958185432",
  appId: "1:855958185432:web:bf52544dc223ffd6f4fead"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);


/*********************************
 🔁 AUTO REDIRECT ON PAGE LOAD
**********************************/
auth.onAuthStateChanged(user => {
  const loginMode = localStorage.getItem("loginMode");
  const avatarCreated = localStorage.getItem("avatarCreated");

  // Logged in user (not guest)
  if (user && loginMode !== "guest") {
    if (!avatarCreated) {
      // First time → avatar page
      window.location.href = "mainpage/Dashboard/avtar.html";
    } else {
      // Normal flow → home
      window.location.href = "mainpage/index.html";
    }
  }
});


/*********************************
 🧭 TAB SWITCHING
**********************************/
const loginTab = document.getElementById("loginTab");
const guestTab = document.getElementById("guestTab");

const loginSection = document.getElementById("loginSection");
const guestSection = document.getElementById("guestSection");

loginTab.onclick = () => {
  loginTab.classList.add("active");
  guestTab.classList.remove("active");
  loginSection.classList.remove("hidden");
  guestSection.classList.add("hidden");
};

guestTab.onclick = () => {
  guestTab.classList.add("active");
  loginTab.classList.remove("active");
  loginSection.classList.add("hidden");
  guestSection.classList.remove("hidden");
};


/*********************************
 🔐 GOOGLE LOGIN
**********************************/
const googleBtn = document.getElementById("googleBtn");

googleBtn.onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    localStorage.setItem("loginMode", "google");
    localStorage.setItem("userEmail", result.user.email);

    const avatarCreated = localStorage.getItem("avatarCreated");

    if (!avatarCreated) {
      window.location.href = "mainpage/Dashboard/avtar.html";
    } else {
      window.location.href = "mainpage/index.html";
    }

  } catch (err) {
    alert(err.message);
  }
};


/*********************************
 ✉️ EMAIL / PASSWORD LOGIN
**********************************/
const manualLoginBtn = document.getElementById("manualLoginBtn");

manualLoginBtn.onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch {
    await auth.createUserWithEmailAndPassword(email, password);
  }

  localStorage.setItem("loginMode", "manual");
  localStorage.setItem("userEmail", email);

  // Manual users always go to avatar first
  window.location.href = "mainpage/Dashboard/avtar.html";
};


/*********************************
 👤 GUEST MODE
**********************************/
const startGuestBtn = document.getElementById("startGuest");

startGuestBtn.onclick = () => {
  localStorage.setItem("loginMode", "guest");
  window.location.href = "mainpage/index.html";
};
