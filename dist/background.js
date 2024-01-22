/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
// background.tsx
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log('Hey you just bookmarked something!');
});

/******/ })()
;
//# sourceMappingURL=background.js.map