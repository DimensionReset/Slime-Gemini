/*
    docs-remover.js || DimensionReset

    Content script to remove "Try Gemini" button
    from Google Docs.
*/

// removes "Try Gemini" button
function removeGeminiButton() {
    // get container with id
    const tryButton = document.querySelector("#docs-sidekick-gen-ai-promo-button-container");

    if (tryButton) {
        tryButton.remove();
        console.log("[Slime-Gemini] \"Try Gemini\" button removed successfully.");
    }

    return false;
}

let observer = null;
let isGeminiDisabled = false;

// temp CSS hiding to prevent flash of content
const hideStyle = document.createElement('style');
hideStyle.id = 'dim-reset-css';

hideStyle.textContent = `
    #docs-sidekick-gen-ai-promo-button-container {
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

            // initial attempt to button
            removeGeminiButton();

            if (!observer) {
                observer = new MutationObserver(() => {
                    // removes gemini button if extension enabled after page load
                    // i should prolly change this but it lowkey tuff
                    if (isGeminiDisabled) {

                        /* after mutation observer begins
                        keep trying to remove button */
                        removeGeminiButton();
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