chrome.runtime.sendMessage(
  { action: "getLoadTime" },
  function (response) {
    document.getElementById("loadTime").textContent = `Load time: ${response.loadTime} ms`;
  }
);
