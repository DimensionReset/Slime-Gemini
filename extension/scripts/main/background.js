/*
    background.js || DimensionReset

    Service worker that handles restricted high-level permissions
    that content scripts cannot use.
*/


// REMOVE GEMINI FROM GOOGLE SEARCH
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // intercept top-level browser
  if (details.frameId !== 0) return;

  const url = new URL(details.url);

  // filter for ONLY google searches
  if (url.hostname.includes("google.com") && url.pathname === "/search") {
    let changed = false;

    if (url.searchParams.get("tbs") !== "li:1") {
      url.searchParams.set("tbs", "li:1");
      changed = true;
    }

    if (changed) {
      chrome.tabs.update(details.tabId, { url: url.toString() });
    }
  }
});
