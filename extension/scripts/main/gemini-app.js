function updateBlockOverlayState(shouldBlock) {
    const overlayId = "slime-gemini-overlay";
    const fontId = "slime-gemini-font";
    let overlay = document.getElementById(overlayId);

    if (shouldBlock) {
        if (!overlay) {
            if (!document.getElementById(fontId)) {
                const customFont = document.createElement("style");
                customFont.id = fontId;
                customFont.textContent = "@import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap');";
                (document.head || document.documentElement).appendChild(customFont);
            }

            overlay = document.createElement("div");
            overlay.id = overlayId;

            // position and layout style
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
            overlay.style.color = "#ffffff";
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.fontFamily = "'Google Sans', sans-serif";
            overlay.style.fontSize = "5rem";
            overlay.style.fontWeight = "bold";
            overlay.style.zIndex = "2147483647";
            overlay.style.pointerEvents = "all";
            overlay.style.userSelect = "none";

            overlay.innerText = "Sorry! Gemini is busy for now.";

            const targetNode = document.body || document.documentElement;
            if (targetNode) {
                targetNode.appendChild(overlay);
            }
        }
    } else {
        if (overlay) overlay.remove();
        
        const fontElement = document.getElementById(fontId);
        if (fontElement) fontElement.remove();
    }
}

function applyGeminiBlockPreference() {
    chrome.storage.local.get(["disable-gemini"], (result) => {
        const isGeminiDisabled = !!result["disable-gemini"];
        updateBlockOverlayState(isGeminiDisabled);
    });
}

// listen for setting change
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes["disable-gemini"]) {
        applyGeminiBlockPreference();
    }
});

// check setting state
if (document.documentElement) {
    applyGeminiBlockPreference();
} else {
    document.addEventListener("DOMContentLoaded", applyGeminiBlockPreference);
}