// js/units.js - Unit Conversion System

const unitConversionData = {
  length: {
    base: "m",
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.34,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
  },
  mass: {
    base: "kg",
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
      oz: 0.0283495,
    },
  },
  // Add more categories like volume, temperature, etc., as needed
};

/**
 * Converts a value from one unit to another within the same category.
 * @param {number} value - The numerical value to convert.
 * @param {string} unitFrom - The unit to convert from (e.g., 'cm').
 * @param {string} unitTo - The unit to convert to (e.g., 'm').
 * @returns {string|number} - The converted value, or an error string.
 */
function convertUnits(value, unitFrom, unitTo) {
  if (typeof value !== "number" || isNaN(value)) {
    return "Error: Invalid value for conversion.";
  }
  unitFrom = unitFrom.toLowerCase();
  unitTo = unitTo.toLowerCase();

  let categoryFrom, categoryTo;

  for (const category in unitConversionData) {
    if (unitConversionData[category].units.hasOwnProperty(unitFrom)) {
      categoryFrom = category;
    }
    if (unitConversionData[category].units.hasOwnProperty(unitTo)) {
      categoryTo = category;
    }
  }

  if (!categoryFrom || !categoryTo) {
    return "Error: One or both units not recognized.";
  }

  if (categoryFrom !== categoryTo) {
    return `Error: Cannot convert between different categories (${categoryFrom} to ${categoryTo}).`;
  }

  const categoryData = unitConversionData[categoryFrom];
  const valueInBaseUnit = value * categoryData.units[unitFrom];
  const convertedValue = valueInBaseUnit / categoryData.units[unitTo];

  // Round to a reasonable number of decimal places, e.g., 6
  return parseFloat(convertedValue.toFixed(6));
}

// Make the main conversion function globally available
self.convertUnits = convertUnits;
self.unitConversionData = unitConversionData; // For potential UI to list units
