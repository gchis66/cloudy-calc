// js/calculator.js - Core Calculator Logic

// Initialize Fcal instance
// Ensure Fcal is loaded globally from fcal.min.js before this script
console.log("Checking fcal global before instantiation:", typeof fcal, fcal);

let fcalInstance = null;
if (typeof fcal === "function") {
  // Scenario 1: global fcal is the constructor (e.g. fcal = function Fcal() { ... } )
  try {
    fcalInstance = new fcal();
    console.log("fcalInstance created using 'new fcal()'");
  } catch (e) {
    console.error("Error trying 'new fcal()':", e);
    // Fall through to check if fcal is an object with a constructor property
  }
}

if (!fcalInstance && typeof fcal === "object" && fcal !== null) {
  // Scenario 2: global fcal is an object, constructor might be fcal.Fcal or fcal.default
  if (typeof fcal.Fcal === "function") {
    try {
      fcalInstance = new fcal.Fcal();
      console.log("fcalInstance created using 'new fcal.Fcal()'");
    } catch (e) {
      console.error("Error trying 'new fcal.Fcal()':", e);
    }
  } else if (typeof fcal.default === "function") {
    try {
      fcalInstance = new fcal.default();
      console.log("fcalInstance created using 'new fcal.default()'");
    } catch (e) {
      console.error("Error trying 'new fcal.default()':", e);
    }
  } else {
    // Scenario 3: global fcal is an object, but it might be the instance itself (if library returns pre-constructed instance)
    // Or we don't know the constructor name yet. For now, we assume it might be an object with evaluate method.
    if (typeof fcal.evaluate === "function") {
      console.log(
        "Global fcal is an object with an evaluate method. Using it directly as the instance."
      );
      fcalInstance = fcal;
    } else {
      console.error(
        "Global fcal is an object, but no known constructor (Fcal, default) or evaluate method found on it."
      );
    }
  }
}

if (!fcalInstance) {
  console.error(
    "fcal library object NOT successfully initialized! Calculations will fail."
  );
}

/**
 * Preprocesses an expression string by substituting known variables with their values from OUR custom store.
 * This might be used to inject variables into fcal's context if needed, or fcal handles its own.
 * For now, we keep it, but its interaction with fcal's own variable system needs consideration.
 */
async function preprocessExpressionWithVariables(expression) {
  if (typeof expression !== "string") return expression;
  if (typeof self.getAllVariables !== "function") {
    // console.warn("getAllVariables function not available for preprocessing.");
    return expression;
  }
  try {
    const variables = await self.getAllVariables();
    // TODO: Decide how these variables should interact with fcal.
    // Option 1: Fcal uses its own variable store (e.g. 'x : 10').
    // Option 2: Inject these variables into fcal for current evaluation: fcalInstance.setValues(variables);
    // For now, this preprocessing might create expressions fcal can directly use if variables are numbers.
    let processedExpression = expression;
    const varNames = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const varName of varNames) {
      const regex = new RegExp(
        `(?<![a-zA-Z0-9])${varName}(?![a-zA-Z0-9])`,
        "g"
      );
      processedExpression = processedExpression.replace(
        regex,
        variables[varName]
      );
    }
    return processedExpression;
  } catch (error) {
    console.error("Error preprocessing variables:", error);
    return expression;
  }
}

/**
 * Evaluates an expression using Fcal.
 * @param {string} originalExpression - The expression as entered by the user.
 * @param {string} processedExpression - The expression (potentially after our custom variable preprocessing).
 * @returns {Promise<string|number>} - The result or an error message.
 */
async function evaluateWithFcal(originalExpression, expressionToEvaluate) {
  if (!fcalInstance) {
    return "Error: Fcal library not loaded.";
  }
  try {
    // If we want to use variables from our own store with fcal:
    if (typeof self.getAllVariables === "function") {
      const customVariables = await self.getAllVariables();
      // Make fcal aware of these variables for this evaluation cycle
      // Note: fcalInstance.setValues might not be the correct API or might have side effects
      // on fcal's internal state if not used carefully. The fcal docs suggest
      // `new Fcal().expression(expr).setValues({}).evaluate()` for isolated contexts.
      // For a persistent fcalInstance, directly setting might be okay or it might need reset.
      // This is a placeholder for a more robust variable integration strategy.
      // For now, we will rely on fcal's own variable definitions or direct numeric substitution.
    }

    const result = fcalInstance.evaluate(expressionToEvaluate);
    let resultString = result.toString();

    // Fcal might return numbers or objects with units that .toString() handles.
    // Example: { value: 23, unit: 'Meters', type: 'unit' } -> "23 Meters"

    // Logging to history (original expression, fcal's result string)
    if (typeof self.addHistoryEntry === "function") {
      await self.addHistoryEntry({
        expression: originalExpression,
        result: resultString,
      });
    }
    return resultString; // Return the string representation from fcal
  } catch (e) {
    console.error(
      `Fcal evaluation error for '${expressionToEvaluate}' (original: '${originalExpression}'):`,
      e
    );
    // Assuming FcalError might be global or attached to fcal.FcalError. Check fcal docs if this specific check fails.
    if (
      typeof FcalError !== "undefined" &&
      e instanceof FcalError &&
      typeof e.info === "function"
    ) {
      return `Error: ${e.info().err} (at: ${e.info().token})`;
    } else if (e.name === "FcalError" && typeof e.info === "function") {
      // Fallback check by name
      return `Error: ${e.info().err} (at: ${e.info().token})`;
    } else if (e.name === "FcalError") {
      return `Error: ${e.message}`;
    }
    return `Error: ${e.message || "Calculation failed"}`;
  }
}

/**
 * Handles calculator input.
 * @param {string} inputString - The raw string from the calculator input.
 * @returns {Promise<string|number>} - The result of evaluation or an error message.
 */
async function processCalculatorInput(inputString) {
  if (typeof inputString !== "string") return "Error: Invalid input type";
  const originalInput = inputString; // Keep original for history
  inputString = inputString.trim();

  // Remove commas from the input string
  inputString = inputString.replace(/,/g, "");

  // --- Chained Calculation Logic ---
  const leadingOperatorRegex = /^[+\-*/%^]/;
  if (leadingOperatorRegex.test(inputString)) {
    if (typeof self.getVariable === "function") {
      try {
        const ansValue = await self.getVariable("ans");
        // Check if ansValue exists and is not null/undefined. Fcal might handle various types.
        if (ansValue !== undefined && ansValue !== null) {
          console.log(
            `Prepending 'ans' value (${ansValue}) to input: ${inputString}`
          );
          // Prepend the answer. Ensure space for clarity if ansValue doesn't end with operator
          // Fcal might handle "4+3" or "4 + 3". Let's add a space for robustness.
          inputString = String(ansValue) + " " + inputString;
        } else {
          // Optional: Could return an error or just proceed without prepending
          console.warn(
            "Input starts with operator, but 'ans' is not set. Evaluating as is."
          );
        }
      } catch (error) {
        console.error("Error retrieving 'ans' for chained calculation:", error);
        // Decide how to handle error: return error or proceed?
        // Proceeding might be less disruptive.
      }
    } else {
      console.warn(
        "getVariable function not available for chained calculation."
      );
    }
  }
  // --- End Chained Calculation Logic ---

  // GS command can stay
  if (originalInput.trim().toLowerCase().startsWith("gs ")) {
    // Check original input for GS command
    const searchQuery = originalInput.substring(3).trim();
    if (!searchQuery) {
      return "Error: No search query provided for Google Search.";
    }
    if (typeof self.sendMessage !== "function") {
      return "Error: Messaging function (sendMessage) not available.";
    }
    try {
      const response = await self.sendMessage("GOOGLE_SEARCH_CALCULATE", {
        query: searchQuery,
      });
      if (response && response.status === "success") {
        if (typeof self.addHistoryEntry === "function") {
          await self.addHistoryEntry({
            expression: originalInput,
            result: response.data,
          });
        }
        return response.data;
      } else {
        const errorMsg = (response && response.data) || "Google Search failed.";
        return `Error: ${errorMsg}`;
      }
    } catch (error) {
      return "Error: Failed to communicate with service worker for Google Search.";
    }
  }

  // Custom unit conversion logic is removed - fcal handles units.
  // Custom assignment logic (varName = expr) is removed for now.
  // Fcal handles its own assignments like "x : 10 + 5".
  // Users will need to use fcal's syntax for assignments for now.

  // For all other inputs, treat as an expression for Fcal to evaluate.
  // We might still want to preprocess with our variables if they are simple numeric subs.
  // Or, better, find a way to pass our variable context to fcal if desired.
  console.log(
    `Fcal evaluation for: ${inputString} (Original: ${originalInput})`
  );

  // Preprocessing with our custom variable store. Fcal will then evaluate this potentially modified string.
  const expressionForFcal = await preprocessExpressionWithVariables(
    inputString
  );

  // Evaluate using the potentially modified inputString, but log the originalInput
  const result = await evaluateWithFcal(originalInput, expressionForFcal);

  // Storing 'ans' - fcal might handle 'ans' internally or we might need to set it.
  // If fcal evaluation result is a number (or can be parsed to one), set it to 'ans' in our store.
  // Fcal results can be like "123 Meters". We need to parse the numeric part for 'ans'.
  if (typeof result === "string" && !result.startsWith("Error:")) {
    const numericPartResult = parseFloat(result); // Extracts leading number
    if (!isNaN(numericPartResult) && typeof self.setVariable === "function") {
      // console.log(`Setting 'ans' to: ${numericPartResult} from result '${result}'`);
      await self.setVariable("ans", numericPartResult);
    }
  }
  return result;
}

self.processCalculatorInput = processCalculatorInput;

// Example usage (would be called from UI code):
// async function handleUserInput(text) {
//   const result = await processCalculatorInput(text);
//   console.log("Final Result/Message:", result);
//   // Update your UI with the result or message
// }
// handleUserInput("foo = 5+3");
// setTimeout(() => handleUserInput("foo * 2"), 1000);
// setTimeout(() => handleUserInput("ans = foo + bar"), 2000); // bar is undefined, should error
// setTimeout(() => handleUserInput("10/2"), 3000);
