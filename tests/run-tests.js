#!/usr/bin/env node

/**
 * Comprehensive test runner for Cloudy Calc Chrome Extension
 * This script provides various testing options and generates detailed reports
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  console.log(colorize(text, 'cyan'));
  console.log('='.repeat(60));
}

function printSection(text) {
  console.log('\n' + colorize(text, 'yellow'));
  console.log('-'.repeat(40));
}

function runCommand(command, description) {
  try {
    console.log(colorize(`Running: ${description}`, 'blue'));
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: path.join(__dirname, '..')
    });
    console.log(output);
    return { success: true, output };
  } catch (error) {
    console.error(colorize(`Error: ${error.message}`, 'red'));
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(colorize(error.stderr, 'red'));
    return { success: false, error: error.message };
  }
}

function printUsage() {
  printHeader('Cloudy Calc Test Runner');
  console.log('Usage: node tests/run-tests.js [options]');
  console.log('\nOptions:');
  console.log('  --all           Run all tests (default)');
  console.log('  --unit          Run unit tests only');
  console.log('  --integration   Run integration tests only');
  console.log('  --coverage      Generate coverage report');
  console.log('  --watch         Run tests in watch mode');
  console.log('  --verbose       Show detailed test output');
  console.log('  --specific <pattern>  Run tests matching pattern');
  console.log('  --help          Show this help message');
  console.log('\nExamples:');
  console.log('  node tests/run-tests.js --all --coverage');
  console.log('  node tests/run-tests.js --specific calculator');
  console.log('  node tests/run-tests.js --unit --verbose');
}

function checkDependencies() {
  printSection('Checking Dependencies');
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(colorize('node_modules not found. Installing dependencies...', 'yellow'));
    runCommand('npm install', 'Installing dependencies');
  } else {
    console.log(colorize('Dependencies found ✓', 'green'));
  }
  
  // Check if Jest is available
  try {
    execSync('npx jest --version', { stdio: 'pipe' });
    console.log(colorize('Jest available ✓', 'green'));
  } catch (error) {
    console.error(colorize('Jest not available. Please run: npm install', 'red'));
    process.exit(1);
  }
}

function generateTestReport() {
  printSection('Generating Test Report');
  
  const reportPath = path.join(__dirname, '..', 'coverage', 'lcov-report', 'index.html');
  if (fs.existsSync(reportPath)) {
    console.log(colorize(`Coverage report generated: ${reportPath}`, 'green'));
    console.log(colorize('Open this file in your browser to view detailed coverage', 'cyan'));
  }
  
  const junitPath = path.join(__dirname, '..', 'junit.xml');
  if (fs.existsSync(junitPath)) {
    console.log(colorize(`JUnit report available: ${junitPath}`, 'green'));
  }
}

function runTestSuite(args) {
  printHeader('Running Cloudy Calc Test Suite');
  
  const options = {
    all: args.includes('--all') || args.length === 0,
    unit: args.includes('--unit'),
    integration: args.includes('--integration'),
    coverage: args.includes('--coverage'),
    watch: args.includes('--watch'),
    verbose: args.includes('--verbose'),
    specific: null
  };
  
  // Check for specific pattern
  const specificIndex = args.indexOf('--specific');
  if (specificIndex !== -1 && specificIndex + 1 < args.length) {
    options.specific = args[specificIndex + 1];
  }
  
  // Build Jest command
  let jestCommand = 'npx jest';
  
  if (options.coverage) {
    jestCommand += ' --coverage';
  }
  
  if (options.watch) {
    jestCommand += ' --watch';
  }
  
  if (options.verbose) {
    jestCommand += ' --verbose';
  }
  
  if (options.specific) {
    jestCommand += ` --testNamePattern="${options.specific}"`;
  } else if (options.unit && !options.integration) {
    jestCommand += ' --testPathPattern="(calculator|variables|factorial)\\.test\\.js"';
  } else if (options.integration && !options.unit) {
    jestCommand += ' --testPathPattern="integration\\.test\\.js"';
  }
  
  // Add additional Jest options for better output
  jestCommand += ' --colors --passWithNoTests';
  
  console.log(colorize(`Running command: ${jestCommand}`, 'blue'));
  
  const result = runCommand(jestCommand, 'Jest Test Suite');
  
  if (result.success) {
    printSection('Test Summary');
    console.log(colorize('✅ All tests completed!', 'green'));
    
    if (options.coverage) {
      generateTestReport();
    }
  } else {
    console.log(colorize('❌ Some tests failed. Check output above for details.', 'red'));
  }
  
  return result.success;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    printUsage();
    return;
  }
  
  try {
    checkDependencies();
    const success = runTestSuite(args);
    
    printSection('Testing Complete');
    
    if (success) {
      console.log(colorize('🎉 All tests passed successfully!', 'green'));
      console.log('\nNext steps:');
      console.log('- Review coverage report if generated');
      console.log('- Run tests in watch mode during development: npm run test:watch');
      console.log('- Add new tests as you develop features');
      process.exit(0);
    } else {
      console.log(colorize('❌ Some tests failed. Please fix the issues and try again.', 'red'));
      process.exit(1);
    }
    
  } catch (error) {
    console.error(colorize(`Unexpected error: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  runTestSuite,
  checkDependencies,
  generateTestReport
};

// Simplified test runner for testing the negative number parsing fix
console.log("Testing Cloudy Calc Negative Number Parsing Fix");

// Mock necessary functions
global.self = {
  getVariable: async (name) => {
    if (name === 'ans') {
      return -9; // Simulate result from previous calculation (1-10)
    }
    return null;
  },
  setVariable: async (name, value) => {
    console.log(`Mock: Variable '${name}' set to:`, value);
    return true;
  }
};

// Import calculator.js
require('../js/calculator.js');

async function runTests() {
  // Test case 1: Chained calculation with negative result (^2)
  console.log("\nTest Case 1: Chained calculation with negative result");
  console.log("Previous result (ans): -9");
  console.log("Input: ^2");
  const result1 = await self.processCalculatorInput("^2");
  console.log("Result:", result1);
  console.log("Expected: 81 (not -81)");
  console.log("Test Passed:", result1 === 81);

  // Test case 2: Multiplying negative numbers
  console.log("\nTest Case 2: Multiplying negative numbers");
  console.log("Input: -9*-9");
  const result2 = await self.processCalculatorInput("-9*-9");
  console.log("Result:", result2);
  console.log("Expected: 81");
  console.log("Test Passed:", result2 === 81);
}

// Run the tests
runTests().then(() => {
  console.log("\nTesting completed.");
}).catch(err => {
  console.error("Error running tests:", err);
}); 