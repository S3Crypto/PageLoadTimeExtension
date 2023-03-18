document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage(
    { action: "getLoadTime" },
    function (response) {
      document.getElementById("loadTime").textContent = `Load time: ${
        response.loadTime === "N/A" ? "N/A" : response.loadTime + " ms"
      }`;
    }
  );

  const checkLinksButton = document.getElementById('check-links');

  checkLinksButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'check_broken_links' });
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'broken_links_report') {
    displayBrokenLinks(request.data);
  }
});

function displayBrokenLinks(brokenLinks) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (brokenLinks.length > 0) {
    brokenLinks.forEach((link) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${link.url} - ${link.status}`;
      resultsContainer.appendChild(listItem);
    });
  } else {
    resultsContainer.textContent = 'No broken links found.';
  }
}

