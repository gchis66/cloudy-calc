// js/history.js - History Tracking Logic

const HISTORY_STORAGE_KEY = "calculationHistory";

/**
 * Adds a new entry to the calculation history.
 * @param {object} entry - The history entry to add (e.g., { expression: string, result: string, timestamp: number }).
 * @returns {Promise<void>}
 */
async function addHistoryEntry(entry) {
  if (
    !entry ||
    typeof entry.expression !== "string" ||
    typeof entry.result !== "string"
  ) {
    console.error("Invalid history entry:", entry);
    return;
  }
  try {
    // Assumes storageUtil is available globally or imported.
    // js/utils/storage.js would need to be loaded in the context (e.g., popup.html or service worker via importScripts)
    const data = await storageUtil.loadState([HISTORY_STORAGE_KEY]);
    const history = data[HISTORY_STORAGE_KEY] || [];
    history.push({ ...entry, timestamp: entry.timestamp || Date.now() });
    // Optional: Limit history size, e.g., to last 100 entries
    // if (history.length > 100) history.shift();
    await storageUtil.saveState({ [HISTORY_STORAGE_KEY]: history });
    console.log("History entry added:", entry);
  } catch (error) {
    console.error("Error adding history entry:", error);
  }
}

/**
 * Retrieves the calculation history.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of history entries.
 */
async function getHistory() {
  try {
    // Assumes storageUtil is available globally or imported.
    const data = await storageUtil.loadState([HISTORY_STORAGE_KEY]);
    return data[HISTORY_STORAGE_KEY] || [];
  } catch (error) {
    console.error("Error retrieving history:", error);
    return [];
  }
}

/**
 * Clears all calculation history.
 * @returns {Promise<void>}
 */
async function clearHistory() {
  try {
    // Assumes storageUtil is available globally or imported.
    await storageUtil.saveState({ [HISTORY_STORAGE_KEY]: [] });
    console.log("Calculation history cleared.");
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

// Make history functions globally accessible if not using modules
self.addHistoryEntry = addHistoryEntry;
self.getHistory = getHistory;
self.clearHistory = clearHistory;

// Note: For storageUtil to be available here, js/utils/storage.js must be loaded
// in the HTML (e.g., popup.html) *before* js/history.js, or be imported if using modules,
// or imported via importScripts() if this runs in the service worker.
// Example for HTML:
// <script src="js/utils/storage.js"></script>
// <script src="js/history.js"></script>
