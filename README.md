# Cloudy Calculator

A powerful Chrome extension calculator with advanced mathematical functions and features.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Advanced math functions through the fcal library
- Mathematical constants (PI)
- Variable assignment and usage
- Unit conversion capabilities
- Factorial calculations
- Command history
- Google search integration

## Usage

### Basic Arithmetic

Enter any mathematical expression in the input field and press Enter to calculate:

```
2 + 2
10 * 5
(25 - 5) / 4
```

### Variables

Assign values to variables using the `@` syntax:

```
@x = 10
@y = 5
@result = x + y
```

Use variables in any expression:

```
@x * 2
```

### Mathematical Constants

The calculator includes the PI constant (case-insensitive):

```
PI
2*pi
Pi*r^2
```

To learn more about mathematical constants, type `help pi` or press F2 while using the calculator.

### Factorial Calculations

The calculator supports factorial calculations in two ways:

1. Using the `!` notation:

   ```
   5!
   ```

2. Using the factorial function:
   ```
   factorial(5)
   ```

Factorials can be used within more complex expressions:

```
2 * 3!
7! / 6!
```

To learn more about factorials, type `help factorial` or press F1 while using the calculator.

### Commands

- `clear` - Clear the calculation history
- `help factorial` - Display help about factorial functionality
- `help pi` or `help constants` - Display help about mathematical constants
- `gs [query]` - Search Google for calculator-related information

## Testing

You can test the factorial functionality using the included test page:

- Open `test-factorial.html` in your browser
- Use the manual testing interface to try different expressions
- View the automatic test results to verify functionality

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder
5. The Cloudy Calculator extension will be added to your browser

## Technologies

- JavaScript
- fcal library for mathematical expression parsing and evaluation
- Chrome Extension APIs
