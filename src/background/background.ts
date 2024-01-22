// background.tsx
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log('Hey you just bookmarked something!');
});
