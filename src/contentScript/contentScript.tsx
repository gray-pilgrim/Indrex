// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchHTML') {
      const htmlContent = document.documentElement.outerHTML;
      chrome.runtime.sendMessage({ html: htmlContent });
    }
  });