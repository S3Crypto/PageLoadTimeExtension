const observer = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (entry.entryType === 'navigation') {
      const loadTime = entry.loadEventEnd - entry.startTime;
      const roundedLoadTime = Math.round(loadTime);
      chrome.runtime.sendMessage({ action: 'setLoadTime', loadTime: roundedLoadTime });
    }
  }
});

observer.observe({ entryTypes: ['navigation'] });
