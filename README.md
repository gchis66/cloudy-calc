# Cloudy Calculator

A powerful Chrome extension calculator with advanced mathematical functions and features for quick calculations directly in your browser.

## Features

- **Basic Arithmetic**: Addition, subtraction, multiplication, division
- **Advanced Math Functions**: Powered by the fcal library for complex expressions
- **Mathematical Constants**: Support for PI (case-insensitive)
- **Variables**: Store and reuse values with custom variable assignment
- **Chained Calculations**: Continue calculations with previous answers
- **Factorial Calculations**: Calculate factorials with both n! and factorial(n) notation
- **Command History**: View and recall previous calculations
- **Google Search Integration**: Search calculation-related information directly
- **Customizable Appearance**: Choose between light and dark themes
- **Pop-out Calculator**: Use the calculator in a separate window

## Usage

### Basic Arithmetic

Enter any mathematical expression in the input field and press Enter to calculate:

```
2 + 2
10 * 5
(25 - 5) / 4
```

### Chained Calculations

Continue calculations using the previous result by starting with an operator:

```
2 + 3     (result: 5)
* 4       (calculates 5 * 4 = 20)
- 10      (calculates 20 - 10 = 10)
```

### Variables

Assign values to variables using the `@` syntax:

```
@x = 10
@y = 5
@result = x + y
```

Use variables in subsequent expressions:

```
@x * 2
@result / 4
```

The calculator automatically stores the most recent result as `ans`, which you can use in calculations:

```
2 + 2     (result: 4)
@x = ans * 2     (sets x to 8)
```

### Mathematical Constants

Use PI in calculations (case-insensitive):

```
PI
2*pi
Pi*r^2
```

### Factorial Calculations

Calculate factorials in two ways:

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

### Commands

- `clear` - Clear the calculation history
- `help factorial` - Display help about factorial functionality
- `help pi` or `help constants` - Display help about mathematical constants
- `gs [query]` - Search Google for calculator-related information

### Customization

Access settings by clicking the "Options" link in the calculator:

- **Theme**: Choose between Light and Dark themes
- **Font Size**: Adjust the calculator's font size for better readability

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the project folder
5. The Cloudy Calculator extension will be added to your browser

## Usage Tips

- Press Enter to calculate expressions
- Click the pop-out icon to use the calculator in a separate window
- Use the up/down arrow keys to navigate through command history
- Right-click on results to copy them to the clipboard

## Technologies

- JavaScript
- fcal library for mathematical expression parsing and evaluation
- Chrome Extension APIs
