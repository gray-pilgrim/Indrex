/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************************!*\
  !*** ./src/contentScript/contentScript.tsx ***!
  \*********************************************/
// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchHTML') {
        const htmlContent = document.documentElement.outerHTML;
        // Send both HTML content and disability type back
        chrome.runtime.sendMessage({ html: htmlContent, disabilityType: request.disabilityType });
        console.log("disability gained is " + request.disabilityType);
    }
});

/******/ })()
;
//# sourceMappingURL=contentScript.js.map