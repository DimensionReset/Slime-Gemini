/*
    popup.js || DimensionReset

    Handles setting toggle in internal menu UI.
*/

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById("switch");
  const van = document.getElementById("van")

  chrome.storage.local.get(["disable-search"], (result) => {
        if (result["disable-search"]) {
            toggleSwitch.checked = true;
            van.classList.add("move");
            document.body.classList.add("bg");
        }
    });

  toggleSwitch.addEventListener('change', (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      van.classList.add("move");
      document.body.classList.add("bg");
      
    } else {
      van.classList.remove("move");
      document.body.classList.remove("bg");
    }

    chrome.storage.local.set({ "disable-search": isChecked });
  });
});