// js/popup.js - Popup UI Logic

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM fully loaded and parsed.");

  const expressionInput = document.getElementById("expression-input");
  const historyContainer = document.getElementById("history-container");
  const clearButton = document.getElementById("clear-button");
  const optionsButton = document.getElementById("options-button");
  const popoutButtonIcon = document.getElementById("popout-button-icon");

  // Function to add entries to the history display
  function addEntryToHistoryDisplay(expression, resultText) {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("history-entry");

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("history-input");
    inputDiv.textContent = `> ${String(expression)}`;

    const outputDiv = document.createElement("div");
    outputDiv.classList.add("history-output");
    outputDiv.textContent = String(resultText);
    if (typeof resultText === "string" && resultText.startsWith("Error:")) {
      outputDiv.classList.add("error");
    }

    entryDiv.appendChild(inputDiv);
    entryDiv.appendChild(outputDiv);
    historyContainer.appendChild(entryDiv);

    // Scroll to the bottom of the history
    if (historyContainer) {
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  }

  // --- Load and display existing history ---
  async function loadAndDisplayHistory() {
    if (typeof self.getHistory === "function" && historyContainer) {
      try {
        const history = await self.getHistory();
        historyContainer.innerHTML = ""; // Clear any static content
        history.forEach((entry) => {
          addEntryToHistoryDisplay(entry.expression, entry.result);
        });
        // Scroll to bottom after loading
        historyContainer.scrollTop = historyContainer.scrollHeight;
      } catch (error) {
        console.error("Error loading history:", error);
      }
    } else {
      console.warn("getHistory function or history container not available.");
    }
  }
  // Load history when the popup is loaded
  loadAndDisplayHistory();
  // --- End Load History ---

  // Handle expression input on Enter key
  if (expressionInput) {
    expressionInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission if any
        const expression = expressionInput.value.trim();
        if (!expression) {
          return; // Do nothing if input is empty
        }

        // Handle "clear" command
        if (expression.toLowerCase() === "clear") {
          historyContainer.innerHTML = "";
          if (typeof self.clearHistory === "function") {
            await self.clearHistory(); // Clear stored history
          }
          expressionInput.value = "";
          expressionInput.focus();
          return;
        }

        if (typeof self.processCalculatorInput === "function") {
          try {
            const result = await self.processCalculatorInput(expression);
            addEntryToHistoryDisplay(expression, result.toString());
            expressionInput.value = ""; // Clear input after calculation
            // 'ans' variable is handled by processCalculatorInput/evaluateProcessedExpression
          } catch (error) {
            console.error("Error processing input in popup:", error);
            addEntryToHistoryDisplay(expression, "Error during calculation.");
          }
        } else {
          console.error("processCalculatorInput is not available.");
          addEntryToHistoryDisplay(
            expression,
            "Error: Calc function not loaded."
          );
        }
        expressionInput.focus();
      }
    });
  }

  // Clear button functionality
  if (clearButton) {
    clearButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (historyContainer) {
        historyContainer.innerHTML = "";
      }
      if (typeof self.clearHistory === "function") {
        await self.clearHistory(); // Clear stored history
      }
      if (expressionInput) {
        expressionInput.value = "";
        expressionInput.focus();
      }
    });
  }

  // Options button functionality
  if (optionsButton) {
    optionsButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        console.warn("chrome.runtime.openOptionsPage is not available.");
        // Fallback or link to options page if needed for other browsers/contexts
        window.open(chrome.runtime.getURL("options.html"));
      }
    });
  }

  // Popout button functionality
  if (popoutButtonIcon) {
    popoutButtonIcon.addEventListener("click", (event) => {
      event.preventDefault();
      chrome.windows.create({
        url: chrome.runtime.getURL("calc.html"),
        type: "popup",
        width: 400,
        height: 600,
      });
    });
  }

  // Set focus to input on load
  if (expressionInput) {
    expressionInput.focus();
  }

  // Removed old calculateButton and resultDisplay logic
  // Removed initializePopup() example as it's not currently used
});

// Note: For sendMessage to be available here, js/utils/messaging.js must be loaded
// in popup.html *before* js/popup.js, or you must use ES modules.
// <script src="js/utils/messaging.js"></script>
// <script src="js/popup.js"></script>
