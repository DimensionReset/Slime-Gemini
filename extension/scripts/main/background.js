/*
    background.js || DimensionReset

    Service worker that handles restricted high-level permissions
    that content scripts cannot use.
*/

// HELPER - ADD/REMOVE GEMINI ON SEARCH
function geminiSearch(details, remove) {
    // intercept top-level browser
	if (details.frameId !== 0) return;

	const url = new URL(details.url);

	// filter for ONLY google searches
	if (url.hostname.includes("google.com") && url.pathname === "/search") {
		let changed = false;

        if (remove) {
            if (url.searchParams.get("tbs") !== "1") {
                url.searchParams.set("tbs", "1");
                changed = true;
            }
        } else {
            if (url.searchParams.get("tbs") == "1") {
                url.searchParams.delete("tbs");
                changed = true;
            }
        }

		if (changed) {
			chrome.tabs.update(details.tabId, { url: url.toString() });
		}
	}
}

// INIT - CHECK GOOGLE SEARCH
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
	chrome.storage.local.get(["disable-gemini"], (result) => {
		if (result["disable-gemini"]) {
            geminiSearch(details, true)
        } else {
            geminiSearch(details, false)
		}
	});
});
