# 🧪 Cloudy Calc Testing Framework

This directory contains a comprehensive Jest-based testing framework for the Cloudy Calc Chrome extension, replacing the previous HTML-based testing approach with a modern, automated testing solution.

## 📁 Test Structure

```
tests/
├── README.md              # This documentation
├── setup.js               # Jest setup and mocking configuration
├── run-tests.js           # Custom test runner with advanced options
├── calculator.test.js     # Core calculator functionality tests
├── variables.test.js      # Variable storage and management tests
└── factorial.test.js      # Factorial function tests
```

## 🚀 Quick Start

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run all tests:**
   ```bash
   npm test
   ```

3. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

### Basic Testing Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:verbose` | Show detailed test output |

## 🔧 Advanced Testing Options

Use the custom test runner for more control:

```bash
# Run specific test file
node tests/run-tests.js --specific calculator

# Run unit tests only
node tests/run-tests.js --unit

# Run with coverage report
node tests/run-tests.js --all --coverage

# Show help
node tests/run-tests.js --help
```

### Available Options

- `--all` - Run all tests (default)
- `--unit` - Run unit tests only
- `--integration` - Run integration tests only
- `--coverage` - Generate coverage report
- `--watch` - Run tests in watch mode
- `--verbose` - Show detailed test output
- `--specific <pattern>` - Run tests matching pattern

## 📊 Test Coverage

The testing framework tracks code coverage across the entire JavaScript codebase:

- **Statements**: How many statements have been executed
- **Branches**: How many control flow branches have been taken
- **Functions**: How many functions have been called
- **Lines**: How many lines of code have been executed

Coverage reports are generated in HTML format and saved to `coverage/lcov-report/index.html`.

## 🧩 Test Categories

### 1. Calculator Core Tests (`calculator.test.js`)

**Focus**: Negative number parsing fix and core arithmetic

Key test suites:
- ✅ **Negative Number Parsing Fix** - Main focus on the bug fix
  - Chained calculations with negative results (`1-10` → `^2` = `81`)
  - Direct negative operations (`-9*-9` = `81`)
  - Edge cases and decimal handling
- ✅ **Basic Arithmetic Operations**
- ✅ **Variable Assignment and Usage**
- ✅ **Mathematical Constants (PI)**
- ✅ **Answer Storage (`ans` variable)**
- ✅ **Error Handling**
- ✅ **History Tracking**
- ✅ **Integration Tests**

### 2. Variables System Tests (`variables.test.js`)

**Focus**: Variable storage, validation, and management

Key test suites:
- ✅ **Variable Storage and Retrieval**
- ✅ **Variable Name Validation**
- ✅ **Variable Deletion**
- ✅ **Case Sensitivity**
- ✅ **Edge Cases and Error Handling**

### 3. Factorial Tests (`factorial.test.js`)

**Focus**: Factorial function and notation parsing

Key test suites:
- ✅ **Core Factorial Function**
- ✅ **Factorial Notation (`5!`)**
- ✅ **Factorial Function Calls (`factorial(5)`)**
- ✅ **Integration with Variables and Chaining**
- ✅ **Error Handling and Edge Cases**

## 🎯 Testing Best Practices

### Writing New Tests

1. **Follow the existing structure:**
   ```javascript
   describe('Feature Name', () => {
     beforeEach(() => {
       global.self.initVariables(); // Clean state
     });

     test('should do something specific', async () => {
       const result = await self.processCalculatorInput('test');
       expect(result).toBe('expected');
     });
   });
   ```

2. **Test both success and failure cases:**
   ```javascript
   test('should handle valid input', async () => {
     const result = await self.processCalculatorInput('5+3');
     expect(result.toString()).toBe('8');
   });

   test('should handle invalid input', async () => {
     const result = await self.processCalculatorInput('invalid');
     expect(result).toContain('Error');
   });
   ```

3. **Use descriptive test names:**
   - ✅ `should correctly handle 1-10 then ^2 (main fix scenario)`
   - ❌ `test negative numbers`

### Mocking Strategy

The test framework uses comprehensive mocking:

- **Chrome APIs**: Mocked using `jest-chrome`
- **fcal Library**: Custom mock for predictable testing
- **Storage System**: In-memory mock for variables and history
- **Console Output**: Controlled to reduce noise during testing

## 🐛 Debugging Tests

### Common Issues

1. **Tests failing due to async operations:**
   ```javascript
   // ❌ Wrong - missing await
   test('should calculate', () => {
     const result = self.processCalculatorInput('5+3');
     expect(result).toBe('8');
   });

   // ✅ Correct - with await
   test('should calculate', async () => {
     const result = await self.processCalculatorInput('5+3');
     expect(result.toString()).toBe('8');
   });
   ```

2. **Variable state bleeding between tests:**
   ```javascript
   beforeEach(() => {
     global.self.initVariables(); // Always clean state
   });
   ```

### Verbose Output

For debugging, run tests with verbose output:
```bash
npm run test:verbose
# or
node tests/run-tests.js --verbose
```

## 📈 Continuous Integration

The testing framework is designed for CI/CD integration:

### GitHub Actions Example

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v1
```

### Exit Codes

- `0` - All tests passed
- `1` - Some tests failed or error occurred

## 🔄 Migration from HTML Tests

The new Jest framework replaces the previous HTML-based tests:

| Old Approach | New Approach |
|--------------|--------------|
| `test-factorial.html` | `tests/factorial.test.js` |
| `test-constants.html` | Integrated into `calculator.test.js` |
| `test-negative-numbers.html` | `tests/calculator.test.js` (main focus) |
| Manual browser testing | Automated Jest execution |
| Visual result checking | Programmatic assertions |

### Benefits of New Framework

- ✅ **Automated execution** - No manual clicking required
- ✅ **Comprehensive coverage** - Track exactly what's tested
- ✅ **CI/CD ready** - Can run in automated pipelines
- ✅ **Better error reporting** - Detailed failure information
- ✅ **Faster execution** - Hundreds of tests in seconds
- ✅ **Professional tooling** - Industry-standard testing framework

## 📝 Contributing

When adding new features to Cloudy Calc:

1. **Write tests first** (TDD approach recommended)
2. **Run existing tests** to ensure no regressions
3. **Add integration tests** for cross-feature interactions
4. **Update test documentation** if needed
5. **Ensure coverage stays high** (aim for >90%)

### Test Naming Convention

- Use `describe()` for feature grouping
- Use clear, descriptive test names
- Include expected behavior in test names
- Group related tests logically

## 🎉 Success Metrics

The testing framework validates the **negative number parsing fix** with comprehensive coverage:

| Original Issue | Test Coverage | Status |
|----------------|---------------|--------|
| `1-10` → `^2` gives `-81` | ✅ Specific test case | 🟢 Fixed |
| `-9*-9` gives `0` | ✅ Direct negative ops tests | 🟢 Fixed |
| Chained calculations broken | ✅ Full chained calc suite | 🟢 Fixed |
| Edge cases uncovered | ✅ Comprehensive edge cases | 🟢 Covered |

**Total Test Count**: 60+ comprehensive tests covering all major functionality

Run `npm run test:coverage` to see the complete coverage report! 