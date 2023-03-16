// Store the load time for each tab
const loadTimes = {};

// Listen for requests to start measuring load time
chrome.webRequest.onSendHeaders.addListener(
  function (details) {
    loadTimes[details.tabId] = Date.now();
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

// Listen for requests to finish and calculate load time
chrome.webRequest.onCompleted.addListener(
  function (details) {
    const startTime = loadTimes[details.tabId];
    if (startTime) {
      const loadTime = Date.now() - startTime;
      loadTimes[details.tabId] = loadTime;
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Handle requests from the popup to retrieve the load time
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getLoadTime") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const loadTime = loadTimes[tabs[0].id];
      sendResponse({ loadTime: loadTime || "N/A" });
    });
    return true;
  }
});
