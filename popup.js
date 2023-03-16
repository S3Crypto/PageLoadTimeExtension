document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage(
    { action: "getLoadTime" },
    function (response) {
      document.getElementById("loadTime").textContent = `Load time: ${
        response.loadTime === "N/A" ? "N/A" : response.loadTime + " ms"
      }`;
    }
  );
});
