// removes ai mode section
function removeAIModeSection() {
    // get container with jsname
    const aiModeSpan = document.querySelector('[jsname="KliEFc"]');

    if (aiModeSpan) {
        // check content
        if (aiModeSpan.textContent.trim().toLowerCase().includes("ai mode")) {
            
            // get ancestor
            const targetSection = aiModeSpan.closest('div.olrp5b') ||
                                  aiModeSpan.closest('.mXwfNd') || 
                                  aiModeSpan.closest('[role="navigation"]') || 
                                  aiModeSpan.closest('div.mVH5Fc') ||
                                  aiModeSpan.parentElement?.parentElement?.parentElement;

            if (targetSection) {
                targetSection.remove();
                console.log("[Extension] AI Mode section removed successfully.");
                return true;
            }
        }
    }
    return false;
}

let observer = null;
let isGeminiDisabled = false;

// temp CSS hiding to prevent flash of content
const hideStyle = document.createElement('style');
hideStyle.id = 'dim-reset-css';
// hideStyle.textContent = `
//     div.olrp5b:has([jsname="KliEFc"]), 
//     .mXwfNd:has([jsname="KliEFc"]) { 
//         display: none !important; 
//     }
// `;

hideStyle.textContent = `
    [jsname="KliEFc"] {
        display: none !important;
    }
`

function applyGeminiPreference() {
    chrome.storage.local.get(["disable-gemini"], (result) => {
        isGeminiDisabled = !!result["disable-gemini"];

        if (isGeminiDisabled) {
            if (!document.getElementById('dim-reset-css')) {
                (document.head || document.documentElement).appendChild(hideStyle);
            }

            removeAIModeSection();

            if (!observer) {
                observer = new MutationObserver(() => {
                    if (isGeminiDisabled) {
                        removeAIModeSection();
                    }
                });

                // Start observing root document immediately (faster than body)
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
        } else {
            if (hideStyle.parentNode) {
                hideStyle.parentNode.removeChild(hideStyle);
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
    });
}

// listen for setting change
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes["disable-gemini"]) {
        applyGeminiPreference();
    }
});

// check setting state
applyGeminiPreference();