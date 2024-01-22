/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************************!*\
  !*** ./src/contentScript/contentScript.tsx ***!
  \*********************************************/
// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchHTML') {
        const htmlContent = document.documentElement.outerHTML;
        chrome.runtime.sendMessage({ html: htmlContent });
    }
});

/******/ })()
;
//# sourceMappingURL=contentScript.js.map