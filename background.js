// Store the start time for each tab
const loadTimes = {};

// Inject the content script when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.executeScript(tabId, { file: 'content.js' });
  }
});

// Listen for the load time from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'setLoadTime') {
    const roundedLoadTime = Math.round(request.loadTime);
    loadTimes[sender.tab.id] = roundedLoadTime;

    // Set the badge text and background color
    chrome.browserAction.setBadgeText({ text: roundedLoadTime.toString(), tabId: sender.tab.id });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4CAF50', tabId: sender.tab.id });
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
