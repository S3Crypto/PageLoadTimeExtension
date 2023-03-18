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

  const list = document.createElement('ul');
  list.classList.add('broken-links-list');
  resultsContainer.appendChild(list);

  if (brokenLinks.length > 0) {
    brokenLinks.forEach((link) => {
      const listItem = document.createElement('li');
      listItem.classList.add('broken-link-item');
      
      const linkText = document.createElement('a');
      linkText.classList.add('broken-link-text');
      linkText.href = link.url;
      linkText.target = '_blank';
      linkText.textContent = link.url;
      listItem.appendChild(linkText);
      
      const linkStatus = document.createElement('span');
      linkStatus.classList.add('broken-link-status');
      linkStatus.textContent = ` - ${link.status}`;
      listItem.appendChild(linkStatus);

      list.appendChild(listItem);
    });
  } else {
    resultsContainer.textContent = 'No broken links found.';
  }
}

