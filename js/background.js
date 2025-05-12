// Service worker
importScripts("utils/network.js"); // For googleCalculatorSearch
// importScripts('utils/storage.js'); // If background needs direct storage access beyond messages
// importScripts('utils/messaging.js'); // If background needs to send messages proactively

chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension state
  // For example, set default values in storage
  console.log("Cloudy Calc extension installed.");
  // chrome.storage.local.set({ defaultSetting: true });
});

// Handle messages from popup, options page, and content scripts (if any)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in service worker:", message);

  if (message.type === "GOOGLE_SEARCH_CALCULATE") {
    if (typeof googleCalculatorSearch === "function") {
      googleCalculatorSearch(message.data.query)
        .then((result) => {
          sendResponse({ status: "success", data: result });
        })
        .catch((error) => {
          console.error("Error during Google search in service worker:", error);
          sendResponse({
            status: "error",
            data: "Google Search failed in service worker",
          });
        });
      return true; // Indicates asynchronous response
    } else {
      console.error(
        "googleCalculatorSearch function not available in service worker."
      );
      sendResponse({ status: "error", data: "Search utility not loaded" });
      return false;
    }
  }

  // Example: Process messages based on type
  // if (message.type === "DO_SOMETHING") {
  //   // Do something with message.data
  //   sendResponse({ status: "success", data: "Processed data" });
  // } else if (message.type === "GET_DATA") {
  //   // Retrieve data and send it back
  //   sendResponse({ status: "success", data: { someKey: "someValue" }});
  // }

  // Return true to indicate you wish to send a response asynchronously
  // This is important if you're doing async operations like fetching data
  // or accessing chrome.storage before sending a response.
  // For synchronous responses, you can just call sendResponse directly.
  return true;
});
