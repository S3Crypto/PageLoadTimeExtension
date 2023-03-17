const observer = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'navigation') {
      const loadTime = entry.loadEventEnd - entry.startTime;
      chrome.runtime.sendMessage({ action: 'setLoadTime', loadTime: loadTime });
    }
  }
});

observer.observe({ entryTypes: ['navigation'] });
