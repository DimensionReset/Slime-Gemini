/*
    tab-remover.js || DimensionReset

    Content script to remove AI mode tab.
*/

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
    // check whether extension is enabled or not
    chrome.storage.local.get(["disable-gemini"], (result) => {
        isGeminiDisabled = !!result["disable-gemini"];

        if (isGeminiDisabled) {

            // temp css to instantly hide tab
            if (!document.getElementById('dim-reset-css')) {
                (document.head || document.documentElement).appendChild(hideStyle);
            }

            // initial attempt to remove tab
            removeAIModeSection();

            if (!observer) {
                observer = new MutationObserver(() => {
                    // removes gemini tab if extension enabled after page load
                    // i should prolly change this but it lowkey tuff
                    if (isGeminiDisabled) {

                        /* after mutation observer begins
                        keep trying to remove ai mode section */
                        removeAIModeSection();
                    }
                });

                // begin observe root document
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