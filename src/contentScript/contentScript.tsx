const htmlContent = document.documentElement.outerHTML;
// chrome.runtime.sendMessage({ html: htmlContent });
// contentScript.js
chrome.runtime.sendMessage({ url: window.location.href });

chrome.runtime.sendMessage({ html: document.documentElement.innerHTML });
// Replace document.documentElement.innerHTML with a more specific selector if needed.
