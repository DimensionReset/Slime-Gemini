/*
    popup.js || DimensionReset

    Handles setting toggle in internal menu UI.
*/

document.addEventListener("DOMContentLoaded", () => {
  const switchVan = document.getElementById("switch-van");
  const switchHostage = document.getElementById("switch-hostage");

  const vanScene = document.getElementById("van-scene");
  const vanStartSound = document.getElementById("van-start");
  const van = document.getElementById("van");

  const hostageScene = document.getElementById("hostage-scene");
  const ambientBuzz = document.getElementById("ambient-buzz");
  const doorOpen = document.getElementById("door-open");
  const gemini = document.getElementById("gemini");

  const loadingScreen = document.getElementById("load-screen");

  // load current state
  chrome.storage.local.get(["disable-gemini", "vanCompleted"], (result) => {

    // if van done, open hostage scene
    if (result["vanCompleted"]) {
      ambientBuzz.play()
      vanScene.style.visibility = "hidden";
      hostageScene.style.visibility = "visible";
      document.body.classList.add("hostage-bg"); // Set background on load

      if (result["disable-gemini"]) {
        switchHostage.checked = true;
      }
    } else if (result["disable-gemini"]) {
      switchVan.checked = true;
    }

    void document.documentElement.offsetHeight;

    document.documentElement.classList.remove("disable-animations");
    if (loadingScreen) loadingScreen.remove();
  });

  // VAN SWITCH
  switchVan.addEventListener("change", (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      van.classList.add("move");
      vanStartSound.play();
      document.body.classList.add("van-bg");
      switchVan.disabled = true;

      // set to hostage
      chrome.storage.local.set({
        vanCompleted: true,
        "disable-gemini": true,
      });
    } else {
      switchVan.disabled = true;
      chrome.storage.local.set({ "disable-gemini": false });
    }
  });

  // HOSTAGE SWITCH
  switchHostage.addEventListener("change", (event) => {
    const isChecked = event.target.checked;

    if (!isChecked) {
      // debounce
      doorOpen.play();
      gemini.classList.add("move");
      switchHostage.disabled = true;

      // set back to van
      chrome.storage.local.set({
        vanCompleted: false,
        "disable-gemini": false,
      });
    } else {
      chrome.storage.local.set({ "disable-gemini": true });
    }
  });
});