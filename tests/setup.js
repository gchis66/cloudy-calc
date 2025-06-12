// Jest setup file for Cloudy Calc Chrome Extension
// This file runs before all tests and sets up the testing environment

// Mock Chrome extension APIs manually
global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        const result = {};
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((data, callback) => {
        if (callback) callback();
        return Promise.resolve();
      }),
      remove: jest.fn((keys, callback) => {
        if (callback) callback();
        return Promise.resolve();
      }),
      clear: jest.fn((callback) => {
        if (callback) callback();
        return Promise.resolve();
      })
    }
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  }
};

// Create a mock storage object to simulate persistent storage between calls
const mockStorage = {
  calculatorVariables: {}
};

// Mock storageUtil implementation for testing
const storageUtil = {
  loadState: async function(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = mockStorage[key] || {};
    });
    return result;
  },
  
  saveState: async function(data) {
    Object.keys(data).forEach(key => {
      mockStorage[key] = data[key];
    });
    return true;
  }
};

// Mock global self object that the extension uses
global.self = {
  // Add storageUtil to self
  storageUtil: storageUtil,
  
  // Mock storage for variables (used for compatibility)
  _variables: new Map(),
  
  // Mock history storage
  _history: [],
  
  addHistoryEntry: async function(entry) {
    this._history.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
  },
  
  getHistory: async function() {
    return [...this._history];
  },
  
  clearHistory: async function() {
    this._history = [];
  },
  
  // Variable validation regex (from variables.js)
  VALID_VARIABLE_NAME_REGEX: /^[a-zA-Z_][a-zA-Z0-9_]*$/
};

// Mock fcal library
global.fcal = function() {
  return {
    evaluate: function(expression) {
      // Basic mock implementation for testing
      // In real tests, we'll load the actual fcal library
      
      // Handle basic arithmetic for testing
      if (expression === '1-10') return -9;
      if (expression === '(-9) ^2') return 81;
      if (expression === '-9*-9') return 81;
      if (expression === '(-9)*(-9)') return 81;
      if (expression === '(-9)^2') return 81;
      if (expression === '5+3') return 8;
      if (expression === '10/2') return 5;
      if (expression === '5-8') return -3;
      if (expression === '(-3) *3') return -9;
      if (expression === '2-7') return -5;
      if (expression === '(-5) +5') return 0;
      if (expression === '0-4') return -4;
      if (expression === '(-4) ^3') return -64;
      if (expression === '1-3') return -2;
      if (expression === '(-2) ^2') return 4;
      
      // Handle factorial
      if (expression === '120') return 120; // 5!
      if (expression === '1') return 1; // 0! or 1!
      if (expression === '3628800') return 3628800; // 10!
      
      // Handle PI
      if (expression.includes('PI')) {
        return expression.replace(/PI/g, Math.PI.toString());
      }
      
      // Fallback: try to evaluate simple expressions
      try {
        // Remove any parentheses and spaces for basic evaluation
        const cleanExpr = expression.replace(/[()]/g, '').replace(/\s+/g, '');
        // This is a very basic fallback - in real tests we'll use actual fcal
        return eval(cleanExpr);
      } catch (e) {
        throw new Error(`Cannot evaluate expression: ${expression}`);
      }
    }
  };
};

// Mock FcalError
global.FcalError = class FcalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FcalError';
  }
  
  info() {
    return {
      err: this.message,
      token: 'unknown'
    };
  }
};

// Clear mocks before each test
beforeEach(() => {
  // Reset Chrome API mocks
  if (global.chrome?.storage?.local?.get?.mockClear) {
    global.chrome.storage.local.get.mockClear();
    global.chrome.storage.local.set.mockClear();
    global.chrome.storage.local.remove.mockClear();
    global.chrome.storage.local.clear.mockClear();
  }
  
  // Reset self storage
  if (global.self._variables) {
    global.self._variables.clear();
  } else {
    global.self._variables = new Map();
  }
  global.self._history = [];
  
  // Ensure initVariables exists
  if (!global.self.initVariables) {
    global.self.initVariables = function() {
      global.self._variables = new Map();
      global.self._history = [];
    };
  }
});

// Console configuration for tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Suppress expected console outputs during tests unless in verbose mode
if (!process.env.JEST_VERBOSE) {
  console.error = (...args) => {
    // Only show errors that aren't expected test scenarios
    if (!args[0]?.includes?.('Error retrieving') && 
        !args[0]?.includes?.('Error processing')) {
      originalConsoleError(...args);
    }
  };
  
  console.warn = (...args) => {
    // Only show warnings that aren't expected test scenarios
    if (!args[0]?.includes?.('Input starts with operator') && 
        !args[0]?.includes?.('getVariable function not available')) {
      originalConsoleWarn(...args);
    }
  };
}

// Restore console after tests
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}); 