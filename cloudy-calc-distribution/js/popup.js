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
    const expressionString = String(expression);
    inputDiv.textContent = `> ${expressionString}`;

    const outputDiv = document.createElement("div");
    outputDiv.classList.add("history-output");
    const resultString = String(resultText);
    outputDiv.textContent = resultString;
    const isError = resultString.startsWith("Error:");
    if (isError) {
      outputDiv.classList.add("error");
    }

    // --- Add Click Listeners ---
    if (expressionInput) {
      inputDiv.addEventListener("click", () => {
        expressionInput.value = expressionString; // Use original expression
        expressionInput.focus();
        // Optional: Select the text after inserting
        expressionInput.select();
      });

      // Only make output clickable if it wasn't an error
      if (!isError) {
        outputDiv.addEventListener("click", () => {
          expressionInput.value = resultString; // Use result string
          expressionInput.focus();
          // Optional: Select the text after inserting
          expressionInput.select();
        });
      }
    }
    // --- End Click Listeners ---

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

  // Function to display help information about factorial functionality
  function showFactorialHelp() {
    const helpInfo = [
      "Factorial Help",
      "",
      "In mathematics, the factorial of a non-negative integer n is the product of all positive integers less than or equal to n.",
      "",
      "Factorial Notation: n!",
      "Example: 5! = 5 × 4 × 3 × 2 × 1 = 120",
      "",
      "You can use factorials in two ways:",
      "1. Using the ! notation: 5!",
      "2. Using the factorial function: factorial(5)",
      "",
      "Examples:",
      "5! → 120",
      "factorial(6) → 720",
      "2 * 3! → 12",
      "7! / 6! → 7",
      "",
      "Note: Factorials grow very quickly. The calculator supports factorials up to the limit of JavaScript's number precision.",
    ];

    historyContainer.innerHTML = ""; // Clear current history

    // Display each line of the help text
    helpInfo.forEach((line) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("history-entry");

      const helpLine = document.createElement("div");
      helpLine.classList.add("history-output");
      helpLine.style.color = "#4285f4"; // Google blue color
      helpLine.textContent = line;

      entryDiv.appendChild(helpLine);
      historyContainer.appendChild(entryDiv);
    });

    // Add a "Back to History" button
    const backDiv = document.createElement("div");
    backDiv.classList.add("history-entry");

    const backButton = document.createElement("button");
    backButton.textContent = "Return to History";
    backButton.style.margin = "10px 0";
    backButton.style.padding = "5px 10px";
    backButton.addEventListener("click", loadAndDisplayHistory);

    backDiv.appendChild(backButton);
    historyContainer.appendChild(backDiv);

    // Scroll to top of help
    historyContainer.scrollTop = 0;
  }

  // Function to display help information about mathematical constants
  function showConstantsHelp() {
    const helpInfo = [
      "Mathematical Constants Help",
      "",
      "This calculator supports the following mathematical constants:",
      "",
      "π (Pi) - The ratio of a circle's circumference to its diameter",
      "Value: 3.14159265358979",
      "",
      "Usage:",
      "• You can use PI in any expression (case-insensitive)",
      "• Examples:",
      "  PI → 3.14159265358979",
      "  2*pi → 6.28318530717959",
      "  Pi/2 → 1.5707963267949",
      "",
      "Applications:",
      "• Circle area: pi*r^2",
      "• Circle circumference: 2*pi*r",
      "• Sine wave period: 2*pi",
      "",
      "Note: The pi constant is case-insensitive, so you can use 'PI', 'pi', 'Pi', or 'pI'.",
    ];

    historyContainer.innerHTML = ""; // Clear current history

    // Display each line of the help text
    helpInfo.forEach((line) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("history-entry");

      const helpLine = document.createElement("div");
      helpLine.classList.add("history-output");
      helpLine.style.color = "#4285f4"; // Google blue color
      helpLine.textContent = line;

      entryDiv.appendChild(helpLine);
      historyContainer.appendChild(entryDiv);
    });

    // Add a "Back to History" button
    const backDiv = document.createElement("div");
    backDiv.classList.add("history-entry");

    const backButton = document.createElement("button");
    backButton.textContent = "Return to History";
    backButton.style.margin = "10px 0";
    backButton.style.padding = "5px 10px";
    backButton.addEventListener("click", loadAndDisplayHistory);

    backDiv.appendChild(backButton);
    historyContainer.appendChild(backDiv);

    // Scroll to top of help
    historyContainer.scrollTop = 0;
  }

  // Handle expression input on Enter key
  if (expressionInput) {
    expressionInput.addEventListener("keydown", async (event) => {
      // Show factorial help when F1 is pressed
      if (event.key === "F1") {
        event.preventDefault();
        showFactorialHelp();
        return;
      }

      // Show constants help when F2 is pressed
      if (event.key === "F2") {
        event.preventDefault();
        showConstantsHelp();
        return;
      }

      // Show factorial help when typing "help factorial" or "factorial help"
      if (
        event.key === "Enter" &&
        (expressionInput.value.trim().toLowerCase() === "help factorial" ||
          expressionInput.value.trim().toLowerCase() === "factorial help")
      ) {
        event.preventDefault();
        showFactorialHelp();
        expressionInput.value = "";
        return;
      }

      // Show constants help when typing "help pi", "help constants", etc.
      if (
        event.key === "Enter" &&
        (expressionInput.value.trim().toLowerCase() === "help pi" ||
          expressionInput.value.trim().toLowerCase() === "help constants" ||
          expressionInput.value.trim().toLowerCase() === "pi help" ||
          expressionInput.value.trim().toLowerCase() === "constants help")
      ) {
        event.preventDefault();
        showConstantsHelp();
        expressionInput.value = "";
        return;
      }

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
          if (typeof self.clearAllVariables === "function") {
            await self.clearAllVariables(); // Clear all variables including 'ans'
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
      if (typeof self.clearAllVariables === "function") {
        await self.clearAllVariables(); // Clear all variables including 'ans'
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
        height: 440, // Adjusted to match the body height (400px) plus window chrome
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
