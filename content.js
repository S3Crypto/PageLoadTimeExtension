const observer = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'navigation') {
      const loadTime = entry.loadEventEnd - entry.startTime;
      chrome.runtime.sendMessage({ action: 'setLoadTime', loadTime: loadTime });
    }
  }
});

observer.observe({ entryTypes: ['navigation'] });

// Broken Link Checker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'check_broken_links') {
    checkBrokenLinks();
  }
});

async function checkBrokenLinks() {
  const links = Array.from(document.querySelectorAll('a[href]'));
  const brokenLinks = [];

  for (const link of links) {
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      if (!response.ok) {
        brokenLinks.push({ url: link.href, status: response.status });
      }
    } catch (error) {
      brokenLinks.push({ url: link.href, status: 'Error' });
    }
  }

  chrome.runtime.sendMessage({
    message: 'broken_links_report',
    data: brokenLinks
  });
}
