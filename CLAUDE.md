# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Testing
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:verbose` - Run tests with verbose output

### Linting
- `npm run lint` - Lint JavaScript files using ESLint
- `npm run lint:fix` - Fix auto-fixable linting issues

### Development Testing
- `node tests/run-tests.js` - Run custom test runner with specific test filtering
- `node tests/fix-verification.js` - Verify negative number parsing fix

## Architecture Overview

This is a Chrome Extension calculator (Manifest V3) that provides advanced mathematical functionality through a popup interface.

### Core Components

**Calculator Engine (`js/calculator.js`)**
- Primary calculation logic using the `fcal` library for mathematical expression parsing
- Handles chained calculations (operations starting with operators like `+`, `-`, `^`)
- CRITICAL: Contains fix for negative number parsing in chained calculations - negative results are wrapped in parentheses to ensure proper mathematical interpretation
- Supports factorial calculations with both `n!` and `factorial(n)` syntax
- Integrates with variable system for storing/retrieving calculation results

**Variable System (`js/variables.js`)**
- Manages variable storage using Chrome's storage API
- Automatic `ans` variable for last calculation result
- User-defined variables with `@variable = value` syntax
- Variable name validation using regex pattern

**Storage Architecture (`js/utils/storage.js`)**
- Centralized Chrome storage management
- Handles both sync and local storage
- Used by variable system and history tracking

**History Management (`js/history.js`)**
- Tracks calculation history
- Provides search and recall functionality
- Integrates with popup UI for history display

**Extension Infrastructure**
- `js/background.js` - Service worker for Manifest V3
- `js/popup.js` - Main popup UI logic
- `js/options.js` - Settings/preferences page
- `manifest.json` - Extension configuration

### Key Dependencies

- **fcal library** (`js/lib/fcal.min.js`) - Mathematical expression parser and evaluator
- **Chrome APIs** - Storage, extension APIs for persistence and UI
- **Jest** - Testing framework with jsdom environment for DOM testing

### Critical Bug Fix

The codebase contains a specific fix for negative number parsing in chained calculations. When users perform operations like:
1. `1-10` (result: `-9`)
2. `^2` (should be `81`, not `-81`)

The fix wraps negative `ans` values in parentheses during chained calculation preprocessing to ensure `(-9)^2` instead of `-9^2`.

### Testing Strategy

- **Jest** with jsdom environment for DOM simulation
- **Comprehensive test coverage** for calculator functions, variables, and edge cases
- **Integration tests** that verify the negative number fix specifically
- **Custom test runner** (`tests/run-tests.js`) for filtered test execution

### File Organization

```
js/
├── calculator.js     # Core calculation engine
├── variables.js      # Variable management
├── history.js        # Calculation history
├── popup.js         # Main UI logic
├── options.js       # Settings page
├── background.js    # Service worker
├── utils/           # Utility modules
│   ├── storage.js   # Storage abstraction
│   ├── messaging.js # Extension messaging
│   └── theme-loader.js # Theme management
└── lib/
    └── fcal.min.js  # Math library
```

## Development Notes

### Working with the fcal Library
The fcal library is loaded globally and requires careful initialization. The calculator.js file contains robust initialization logic that handles different loading scenarios.

### Chrome Extension Context
All storage operations are asynchronous and use Chrome's storage API. The extension uses Manifest V3 with a service worker background script.

### Testing Negative Number Fix
Use `npm test` to run the comprehensive test suite that validates the negative number parsing fix. The tests specifically verify that chained calculations with negative results work correctly.