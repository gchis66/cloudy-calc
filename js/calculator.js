// js/calculator.js - Core Calculator Logic

// Add factorial function implementation
/**
 * Calculates factorial for a given number
 * @param {number} n - The number to calculate factorial for
 * @returns {number} - The factorial result
 */
function calculateFactorial(n) {
  // Validate input - must be non-negative integer
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial requires a non-negative integer");
  }

  // Base case: 0! = 1
  if (n === 0) return 1;

  // Use iterative approach to avoid stack overflow with large numbers
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;

    // Check for overflow - factorial grows very quickly
    if (!isFinite(result)) {
      throw new Error("Factorial result too large to calculate");
    }
  }

  return result;
}

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
    let processedExpression = expression;
    // Sort variable names by length descending to handle longer names first (e.g., var1 before var)
    const varNames = Object.keys(variables).sort((a, b) => b.length - a.length);

    for (const varName of varNames) {
      // Regex to find varName (e.g., "x", "ans", "my_var") as a whole word.
      // \b creates a word boundary.
      const variableRegex = new RegExp(`\\b${varName}\\b`, "g");

      // variables[varName] is now guaranteed to be a number or string from storage.
      const valueToSubstitute = String(variables[varName]);
      processedExpression = processedExpression.replace(
        variableRegex,
        valueToSubstitute
      );
    }
    return processedExpression;
  } catch (error) {
    console.error("Error preprocessing variables:", error);
    return expression;
  }
}

/**
 * Preprocesses an expression string to handle factorial notation
 * @param {string} expression - The expression to preprocess
 * @returns {string} - The processed expression with factorials calculated
 */
function preprocessFactorials(expression) {
  if (typeof expression !== "string") return expression;

  // Regular expression to find factorial notation (number followed by !)
  // This handles basic factorial expressions like 5! or 10!
  const factorialRegex = /(\d+)!/g;

  // Replace all factorial notations with their calculated values
  let processedExpression = expression.replace(
    factorialRegex,
    (match, number) => {
      try {
        const n = parseInt(number, 10);
        const factorialValue = calculateFactorial(n);
        return factorialValue.toString();
      } catch (error) {
        console.error(`Error calculating factorial for ${number}:`, error);
        // Keep the original notation if calculation fails
        // This will be caught later in the evaluation process
        return match;
      }
    }
  );

  return processedExpression;
}

/**
 * Preprocesses an expression string to handle case-insensitive mathematical constants
 * @param {string} expression - The expression to preprocess
 * @returns {string} - The processed expression with standardized constant names
 */
function preprocessConstants(expression) {
  if (typeof expression !== "string") return expression;

  // Convert all case variations of pi to the standard uppercase PI that fcal recognizes
  // Use word boundaries to avoid replacing "pi" in words like "recipe"
  const piRegex = /\b([pP][iI])\b/g;
  let processedExpression = expression.replace(piRegex, "PI");

  return processedExpression;
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
    // Preprocess constants to handle case-insensitive variations
    expressionToEvaluate = preprocessConstants(expressionToEvaluate);

    // First check if the expression contains factorial notation
    // and preprocess it before sending to fcal
    expressionToEvaluate = preprocessFactorials(expressionToEvaluate);

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

  // Handle direct factorial function call - factorial(n)
  const factorialFunctionRegex = /^factorial\((\d+)\)$/i;
  const factorialMatch = inputString.match(factorialFunctionRegex);

  if (factorialMatch) {
    const number = parseInt(factorialMatch[1], 10);
    try {
      const result = calculateFactorial(number);

      // Add to history
      if (typeof self.addHistoryEntry === "function") {
        await self.addHistoryEntry({
          expression: originalInput,
          result: result.toString(),
        });
      }

      // Store as 'ans'
      if (typeof self.setVariable === "function") {
        await self.setVariable("ans", result);
      }

      return result.toString();
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  // Regex for variable assignment: @var_name = value
  const assignmentRegex = /^@([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/;
  const assignmentMatch = inputString.match(assignmentRegex);

  if (assignmentMatch) {
    const varName = assignmentMatch[1];
    const valueExpression = assignmentMatch[2];

    // Validate the variable name using the regex from variables.js
    // Assumes VALID_VARIABLE_NAME_REGEX is available globally or via self.
    if (
      self.VALID_VARIABLE_NAME_REGEX &&
      !self.VALID_VARIABLE_NAME_REGEX.test(varName)
    ) {
      return `Error: Invalid variable name '${varName}'. Must start with a letter or underscore and contain only alphanumeric characters or underscores.`;
    }

    try {
      // Evaluate the value expression before setting the variable.
      let processedValueExpression = await preprocessExpressionWithVariables(
        valueExpression
      );

      // Handle case-insensitive PI in variable assignments
      processedValueExpression = preprocessConstants(processedValueExpression);

      // Process factorials in the value expression
      processedValueExpression = preprocessFactorials(processedValueExpression);

      let calculatedValue;
      if (fcalInstance) {
        calculatedValue = fcalInstance.evaluate(processedValueExpression);
      } else {
        return "Error: Fcal library not loaded, cannot calculate variable value.";
      }

      let valueToStore;
      if (
        typeof calculatedValue === "number" ||
        typeof calculatedValue === "string"
      ) {
        // If fcal returns a number or a string, use it directly.
        valueToStore = calculatedValue;
      } else if (
        calculatedValue !== null &&
        typeof calculatedValue.toString === "function"
      ) {
        // For other types (like fcal objects), use their toString() representation.
        // This relies on fcal objects having a toString() method that produces
        // a string that fcal can understand if used in a future expression.
        valueToStore = calculatedValue.toString();
      } else {
        // Fallback for unexpected types (e.g., null or objects without toString)
        console.warn(
          "Unexpected type from fcal for variable assignment:",
          calculatedValue
        );
        valueToStore = String(calculatedValue); // Best effort
      }

      // If valueToStore is now a string that represents a plain number (e.g., "123", "123.45"),
      // convert it to a number type for type consistency. Avoids storing "10" instead of 10.
      if (typeof valueToStore === "string") {
        const num = Number(valueToStore);
        // Check if it's a finite number and if the string conversion is lossless (String(num) === valueToStore)
        if (isFinite(num) && String(num) === valueToStore) {
          valueToStore = num;
        }
      }

      if (valueToStore === undefined) {
        // self.setVariable also checks for undefined, but good to catch earlier.
        return `Error setting variable '${varName}': The value expression resulted in undefined.`;
      }

      if (typeof self.setVariable === "function") {
        const success = await self.setVariable(varName, valueToStore);
        if (!success) {
          // setVariable might return false if validation fails (e.g. name check, though we also check here)
          // or if storage fails. The console.error is in setVariable itself.
          return `Error: Could not store variable '${varName}'. Check console for details.`;
        }
        // Add to history
        if (typeof self.addHistoryEntry === "function") {
          await self.addHistoryEntry({
            expression: originalInput,
            result: `Variable '${varName}' set to ${valueToStore}`,
          });
        }
        return `Variable '${varName}' set to ${valueToStore}`;
      } else {
        return "Error: Variable storage function (setVariable) not available.";
      }
    } catch (e) {
      console.error(`Error processing assignment for '${varName}':`, e);
      // Attempt to provide a more specific error from fcal if it's an FcalError
      if (
        (typeof FcalError !== "undefined" &&
          e instanceof FcalError &&
          typeof e.info === "function") ||
        (e.name === "FcalError" && typeof e.info === "function")
      ) {
        return `Error in value for '${varName}': ${e.info().err} (at: ${
          e.info().token
        })`;
      }
      return `Error setting variable '${varName}': ${
        e.message || "Calculation failed"
      }`;
    }
  }

  // Remove commas from the input string (moved down after assignment check)
  inputString = inputString.replace(/,/g, "");

  // --- Chained Calculation Logic ---
  const leadingOperatorRegex = /^[+\-*/%^]/;
  if (leadingOperatorRegex.test(inputString)) {
    if (typeof self.getVariable === "function") {
      try {
        const ansValue = await self.getVariable("ans");
        // Check if ansValue exists and is not null/undefined
        if (ansValue !== undefined && ansValue !== null) {
          console.log(
            `Prepending 'ans' value (${ansValue}) to input: ${inputString}`
          );
          
          // Convert ansValue to string
          let ansString = String(ansValue);
          
          // If the answer is negative, wrap it in parentheses to ensure proper parsing
          // This prevents issues like "-9^2" being parsed as "-(9^2)" instead of "(-9)^2"
          if (parseFloat(ansValue) < 0) {
            ansString = `(${ansString})`;
          }
          
          // Prepend the answer with a space for clarity
          inputString = ansString + " " + inputString;
          
          console.log(`Final expression after prepending: ${inputString}`);
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

  // GS command removed as Google search functionality is no longer supported

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

// Make factorial function available globally for potential direct access from UI
self.calculateFactorial = calculateFactorial;

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
