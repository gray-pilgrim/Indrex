/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled...')
})


chrome.bookmarks.onCreated.addListener(() => {
    console.log('Hey you just bookmarked something!')
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["contentScript.js"]
  });
});

  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHTML") {
      sendResponse({ html: document.documentElement.outerHTML });
    }
  });
/******/ })()
;
//# sourceMappingURL=background.js.map