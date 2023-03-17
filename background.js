// Store the start time for each tab
const startTimes = {};

// Listen for the tab to be updated and store the start time
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading" && tab.active) {
    startTimes[tabId] = Date.now();
  } else if (changeInfo.status === 'complete' && tab.active) {
    const tabLoadTime = startTimes[tabId];
    if (tabLoadTime && tabLoadTime.startTime) {
      tabLoadTime.endTime = Date.now();
      tabLoadTime.loadTime = tabLoadTime.endTime - tabLoadTime.startTime;
    }
  }
});

// Handle requests from the popup to retrieve the load time
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getLoadTime") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const startTime = startTimes[tabs[0].id];
      if (startTime) {
        const loadTime = Date.now() - startTime;
        sendResponse({ loadTime: loadTime });
      } else {
        sendResponse({ loadTime: "N/A" });
      }
    });
    return true;
  }
});
