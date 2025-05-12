// js/variables.js - Variable Management System

const VARIABLE_STORAGE_KEY = "calculatorVariables";
const VALID_VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;

/**
 * Sets a variable's value. Validates variable name.
 * @param {string} name - The name of the variable (e.g., "x", "ans").
 * @param {any} value - The value to store for the variable.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
async function setVariable(name, value) {
  if (!VALID_VARIABLE_NAME_REGEX.test(name)) {
    console.error(
      `Invalid variable name: ${name}. Must start with a letter and contain only alphanumeric characters.`
    );
    return false;
  }
  if (value === undefined) {
    console.error(`Cannot set variable '${name}' to undefined.`);
    return false;
  }
  try {
    const data = await self.storageUtil.loadState([VARIABLE_STORAGE_KEY]);
    const variables = data[VARIABLE_STORAGE_KEY] || {};
    variables[name] = value;
    await self.storageUtil.saveState({ [VARIABLE_STORAGE_KEY]: variables });
    console.log(`Variable '${name}' set to:`, value);
    return true;
  } catch (error) {
    console.error(`Error setting variable '${name}':`, error);
    return false;
  }
}

/**
 * Gets a variable's value.
 * @param {string} name - The name of the variable.
 * @returns {Promise<any|undefined>} - The value of the variable, or undefined if not found or error.
 */
async function getVariable(name) {
  try {
    const data = await self.storageUtil.loadState([VARIABLE_STORAGE_KEY]);
    const variables = data[VARIABLE_STORAGE_KEY] || {};
    return variables[name]; // Returns undefined if name doesn't exist
  } catch (error) {
    console.error(`Error getting variable '${name}':`, error);
    return undefined;
  }
}

/**
 * Gets all stored variables.
 * @returns {Promise<object>} - An object containing all variables, or an empty object if none or error.
 */
async function getAllVariables() {
  try {
    const data = await self.storageUtil.loadState([VARIABLE_STORAGE_KEY]);
    return data[VARIABLE_STORAGE_KEY] || {};
  } catch (error) {
    console.error("Error getting all variables:", error);
    return {};
  }
}

/**
 * Deletes a specific variable.
 * @param {string} name - The name of the variable to delete.
 * @returns {Promise<boolean>} - True if successful or variable didn't exist, false on error.
 */
async function deleteVariable(name) {
  try {
    const data = await self.storageUtil.loadState([VARIABLE_STORAGE_KEY]);
    const variables = data[VARIABLE_STORAGE_KEY] || {};
    if (variables.hasOwnProperty(name)) {
      delete variables[name];
      await self.storageUtil.saveState({ [VARIABLE_STORAGE_KEY]: variables });
      console.log(`Variable '${name}' deleted.`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting variable '${name}':`, error);
    return false;
  }
}

/**
 * Clears all stored variables.
 * @returns {Promise<boolean>} - True if successful, false on error.
 */
async function clearAllVariables() {
  try {
    await self.storageUtil.saveState({ [VARIABLE_STORAGE_KEY]: {} });
    console.log("All variables cleared.");
    return true;
  } catch (error) {
    console.error("Error clearing all variables:", error);
    return false;
  }
}

// Make functions globally accessible if not using modules
self.setVariable = setVariable;
self.getVariable = getVariable;
self.getAllVariables = getAllVariables;
self.deleteVariable = deleteVariable;
self.clearAllVariables = clearAllVariables;
self.VALID_VARIABLE_NAME_REGEX = VALID_VARIABLE_NAME_REGEX;
