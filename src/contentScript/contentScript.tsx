// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchHTML') {
    const htmlContent = document.documentElement.outerHTML;
    // Send both HTML content and disability type back
    chrome.runtime.sendMessage({ html: htmlContent, disabilityType: request.disabilityType , preliminaryType: request.preliminaryType});
    console.log("disability gained is " + request.disabilityType);
  }
});/*{ inclusivity_analysis: "This product is not accessible and should be thrown out of the window. A preliminary analysis is 1/5 (just a normal string analysing the stuff)", 
augmenting_products: {something like an array or list which will list the additional augmenting products based on the disability selected and prompt given. PS: the data structure should be easily usable for web dev guys}} */
