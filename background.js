// Store the start time for each tab
const loadTimes = {};

// Listen for the tab to be updated and store the start time
/*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading" && tab.active) {
    startTimes[tabId] = Date.now();
  } else if (changeInfo.status === 'complete' && tab.active) {
    const tabLoadTime = startTimes[tabId];
    if (tabLoadTime && tabLoadTime.startTime) {
      tabLoadTime.endTime = Date.now();
      tabLoadTime.loadTime = tabLoadTime.endTime - tabLoadTime.startTime;
    }
  }
});*/

// Inject the content script when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.executeScript(tabId, { file: 'content.js' });
  }
});

// Listen for the load time from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'setLoadTime') {
    loadTimes[sender.tab.id] = request.loadTime;
  }
});

// Handle requests from the popup to retrieve the load time
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getLoadTime') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const loadTime = loadTimes[tabs[0].id];
      if (loadTime) {
        sendResponse({ loadTime: loadTime });
      } else {
        sendResponse({ loadTime: 'N/A' });
      }
    });
    return true;
  }
});
