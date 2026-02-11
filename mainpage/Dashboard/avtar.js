let selectedAvatar = null;

// ✅ WAIT for DOM first
document.addEventListener("DOMContentLoaded", () => {

  const auth = firebase.auth();

  // 🔥 MAKE CALLBACK ASYNC
  auth.onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "index2.html";
      return;
    }

    // ✅ CHECK IF PROFILE ALREADY EXISTS
    const res = await fetch(
      `http://localhost:8080/api/game/profileStatus?email=${user.email}`
    );

    const profileCreated = await res.json();

    // ✅ IF PROFILE EXISTS → SKIP AVATAR PAGE
    if (profileCreated) {
      window.location.href = "index2.html";
      return;
    }

    // 👇 ONLY RUN IF PROFILE NOT CREATED
    const avatars = document.querySelectorAll(".avatar-grid img");
    const saveBtn = document.getElementById("saveProfile");

    console.log("avatars found:", avatars.length);
    console.log("saveBtn:", saveBtn);

    // ✅ Avatar selection
    avatars.forEach(img => {
      img.addEventListener("click", () => {
        avatars.forEach(a => a.classList.remove("selected"));
        img.classList.add("selected");
        selectedAvatar = img.dataset.avatar;
      });
    });

    // ✅ Save profile
    saveBtn.addEventListener("click", async () => {
      const name = document.getElementById("playerName").value.trim();

      if (!name || !selectedAvatar) {
        alert("Name & avatar required");
        return;
      }

      const payload = {
        email: user.email,
        name,
        avatar: selectedAvatar
      };

      await fetch("http://localhost:8080/api/game/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      window.location.href = "index2.html";
    });
  });
});
