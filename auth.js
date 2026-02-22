const auth = firebase.auth();   // ✅ ONLY ONCE
auth.useDeviceLanguage();

const loginTab = document.getElementById("loginTab");
const guestTab = document.getElementById("guestTab");
const loginSection = document.getElementById("loginSection");
const guestSection = document.getElementById("guestSection");
const BASE_URL = "https://brightminds-backend-3.onrender.com";

/* ---------------- TAB SWITCHING ---------------- */

loginTab?.addEventListener("click", () => {
  loginTab.classList.add("active");
  guestTab.classList.remove("active");
  loginSection.classList.remove("hidden");
  guestSection.classList.add("hidden");
});

guestTab?.addEventListener("click", () => {
  guestTab.classList.add("active");
  loginTab.classList.remove("active");
  guestSection.classList.remove("hidden");
  loginSection.classList.add("hidden");
});


/* AUTH LISTENER */
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  console.log("Logged in user:", user.email);

  localStorage.setItem("userEmail", user.email);

  try {
    const response = await fetch(
      `${BASE_URL}/api/game/profileStatus?email=${encodeURIComponent(user.email)}`
    );

    const profileCreated = await response.json();

    if (profileCreated) {
      window.location.replace("mainpage/index.html");
    } else {
      window.location.replace("mainpage/Dashboard/avtar.html");
    }

  } catch (error) {
    console.error("Profile check failed", error);
  }
});

/* GOOGLE LOGIN */
document.getElementById("googleBtn")?.addEventListener("click", async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch (error) {
    console.error("Google login failed:", error);
    alert(error.message);
  }
});
/* ---------------- GUEST LOGIN ---------------- */

document.getElementById("startGuest")?.addEventListener("click", () => {
  window.location.href = "mainpage/guest.html";
});

/* ---------------- MANUAL LOGIN ---------------- */

document.getElementById("manualLoginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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

