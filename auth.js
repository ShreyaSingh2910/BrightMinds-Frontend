// ================= AUTH INSTANCE =================
// Firebase MUST already be initialized in firebase-init.js
const auth = firebase.auth();
const loginTab = document.getElementById("loginTab");
const guestTab = document.getElementById("guestTab");
const loginSection = document.getElementById("loginSection");
const guestSection = document.getElementById("guestSection");

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  guestTab.classList.remove("active");
  loginSection.classList.remove("hidden");
  guestSection.classList.add("hidden");
});

guestTab.addEventListener("click", () => {
  guestTab.classList.add("active");
  loginTab.classList.remove("active");
  guestSection.classList.remove("hidden");
  loginSection.classList.add("hidden");
});

// Keep user logged in across reloads / restarts
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// ================= SINGLE SOURCE OF TRUTH =================
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    localStorage.removeItem("userEmail");
    return;
  }

  localStorage.setItem("loginMode", "google");
  localStorage.setItem("userEmail", user.email);

  try {
    const response = await fetch(
      `http://localhost:8080/api/game/profileStatus?email=${encodeURIComponent(user.email)}`
    );

    const profileCreated = await response.json();

    if (profileCreated) {
      window.location.replace("index2.html");
    } else {
      window.location.replace("avtar.html");
    }
  } catch (error) {
    console.error("Profile check failed", error);
  }
});


// ================= LOGIN ACTIONS =================

document.getElementById("startGuest").addEventListener("click", () => {
localStorage.setItem("loginMode","guest");
 localStorage.removeItem("userEmail");
  window.location.href="guest.html";
});

// GOOGLE LOGIN
document.getElementById("googleBtn")?.addEventListener("click", async () => {
  try {
    localStorage.setItem("loginMode", "google"); // ✅ ADD THIS
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.error(error);
    alert("Google sign-in failed");
  }
});

// MANUAL LOGIN / REGISTER
document.getElementById("manualLoginBtn")?.addEventListener("click", async () => {
localStorage.removeItem("loginMode");
localStorage.setItem("loginMode","google");
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }
});

