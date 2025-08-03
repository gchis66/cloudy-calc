// Storage utility functions
const storageUtil = {
  saveState: (data) => {
    return chrome.storage.local.set(data);
  },
  loadState: (keys) => {
    return chrome.storage.local.get(keys);
  },
};

// To make it accessible in other scripts if modules are not set up (e.g. in service worker or HTML pages)
self.storageUtil = storageUtil;
