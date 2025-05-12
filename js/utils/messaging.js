// Messaging utility

const sendMessage = (type, data) => {
  return chrome.runtime.sendMessage({ type, data });
};

// To make it accessible in other scripts if modules are not set up
self.sendMessage = sendMessage;
