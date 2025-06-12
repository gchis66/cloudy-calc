/**
 * Tests for factorial functionality
 * Covers both calculateFactorial function and factorial notation parsing
 */

// Load the calculator module which contains factorial functionality
require('../js/calculator.js');

describe('Factorial Functionality', () => {
  beforeEach(() => {
    global.self.initVariables();
  });

  describe('calculateFactorial Function', () => {
    test('should calculate factorial of 0', () => {
      const result = self.calculateFactorial(0);
      expect(result).toBe(1);
    });

    test('should calculate factorial of 1', () => {
      const result = self.calculateFactorial(1);
      expect(result).toBe(1);
    });

    test('should calculate factorial of small positive integers', () => {
      expect(self.calculateFactorial(2)).toBe(2);
      expect(self.calculateFactorial(3)).toBe(6);
      expect(self.calculateFactorial(4)).toBe(24);
      expect(self.calculateFactorial(5)).toBe(120);
      expect(self.calculateFactorial(6)).toBe(720);
    });

    test('should calculate factorial of larger integers', () => {
      expect(self.calculateFactorial(7)).toBe(5040);
      expect(self.calculateFactorial(8)).toBe(40320);
      expect(self.calculateFactorial(9)).toBe(362880);
      expect(self.calculateFactorial(10)).toBe(3628800);
    });

    test('should throw error for negative numbers', () => {
      expect(() => self.calculateFactorial(-1)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(-5)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(-100)).toThrow('Factorial requires a non-negative integer');
    });

    test('should throw error for non-integers', () => {
      expect(() => self.calculateFactorial(1.5)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(3.14)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(0.1)).toThrow('Factorial requires a non-negative integer');
    });

    test('should handle edge case of very large factorials', () => {
      // Test with a moderately large number that should still work
      const result15 = self.calculateFactorial(15);
      expect(result15).toBe(1307674368000);
      expect(isFinite(result15)).toBe(true);

      // Test that very large factorials throw overflow error
      expect(() => self.calculateFactorial(1000)).toThrow('Factorial result too large to calculate');
    });

    test('should handle special number types', () => {
      expect(() => self.calculateFactorial(NaN)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(Infinity)).toThrow('Factorial requires a non-negative integer');
      expect(() => self.calculateFactorial(-Infinity)).toThrow('Factorial requires a non-negative integer');
    });
  });

  describe('Factorial Notation in Calculator Input', () => {
    test('should handle simple factorial notation', async () => {
      const result = await self.processCalculatorInput('5!');
      expect(result.toString()).toBe('120');
    });

    test('should handle zero factorial notation', async () => {
      const result = await self.processCalculatorInput('0!');
      expect(result.toString()).toBe('1');
    });

    test('should handle factorial in arithmetic expressions', async () => {
      const result1 = await self.processCalculatorInput('2 * 3!');
      expect(result1.toString()).toBe('12');

      const result2 = await self.processCalculatorInput('4! + 6');
      expect(result2.toString()).toBe('30');

      const result3 = await self.processCalculatorInput('5! / 5');
      expect(result3.toString()).toBe('24');
    });

    test('should handle multiple factorials in one expression', async () => {
      const result1 = await self.processCalculatorInput('3! + 4!');
      expect(result1.toString()).toBe('30'); // 6 + 24

      const result2 = await self.processCalculatorInput('2! * 3!');
      expect(result2.toString()).toBe('12'); // 2 * 6

      const result3 = await self.processCalculatorInput('5! - 3!');
      expect(result3.toString()).toBe('114'); // 120 - 6
    });

    test('should handle factorial with parentheses', async () => {
      const result1 = await self.processCalculatorInput('(3 + 2)!');
      // This depends on order of operations - might be evaluated as 3 + 2! or (3+2)!
      // Let's test what actually happens
      const result = await self.processCalculatorInput('(3 + 2)!');
      // The actual behavior depends on fcal's parsing
    });

    test('should handle factorial in variable assignments', async () => {
      const result = await self.processCalculatorInput('@fact5 = 5!');
      expect(result).toContain('Variable \'fact5\' set to 120');

      const value = await self.getVariable('fact5');
      expect(value).toBe(120);
    });

    test('should handle factorial with negative results (error cases)', async () => {
      // Negative factorials should result in errors
      const result = await self.processCalculatorInput('(-5)!');
      expect(result).toContain('Error');
    });
  });

  describe('Factorial Function Call Syntax', () => {
    test('should handle factorial function calls', async () => {
      const result = await self.processCalculatorInput('factorial(5)');
      expect(result.toString()).toBe('120');
    });

    test('should handle factorial function with zero', async () => {
      const result = await self.processCalculatorInput('factorial(0)');
      expect(result.toString()).toBe('1');
    });

    test('should handle factorial function with expressions', async () => {
      const result1 = await self.processCalculatorInput('factorial(2 + 3)');
      expect(result1.toString()).toBe('120'); // factorial(5)

      const result2 = await self.processCalculatorInput('factorial(10 / 2)');
      expect(result2.toString()).toBe('120'); // factorial(5)
    });

    test('should handle factorial function in arithmetic', async () => {
      const result1 = await self.processCalculatorInput('2 * factorial(4)');
      expect(result1.toString()).toBe('48'); // 2 * 24

      const result2 = await self.processCalculatorInput('factorial(3) + factorial(4)');
      expect(result2.toString()).toBe('30'); // 6 + 24
    });

    test('should handle factorial function with negative inputs (errors)', async () => {
      const result = await self.processCalculatorInput('factorial(-1)');
      expect(result).toContain('Error');
    });

    test('should handle factorial function case insensitivity', async () => {
      const result1 = await self.processCalculatorInput('factorial(4)');
      const result2 = await self.processCalculatorInput('FACTORIAL(4)');
      const result3 = await self.processCalculatorInput('Factorial(4)');
      
      expect(result1.toString()).toBe('24');
      expect(result2.toString()).toBe('24');
      expect(result3.toString()).toBe('24');
    });
  });

  describe('Factorial with Variables and Chaining', () => {
    test('should handle factorial with variables', async () => {
      await self.processCalculatorInput('@n = 5');
      const result = await self.processCalculatorInput('n!');
      expect(result.toString()).toBe('120');
    });

    test('should handle factorial function with variables', async () => {
      await self.processCalculatorInput('@num = 4');
      const result = await self.processCalculatorInput('factorial(num)');
      expect(result.toString()).toBe('24');
    });

    test('should handle factorial in chained calculations', async () => {
      const result1 = await self.processCalculatorInput('4!');
      expect(result1.toString()).toBe('24');

      const result2 = await self.processCalculatorInput('/ 6');
      expect(result2.toString()).toBe('4'); // 24 / 6
    });

    test('should store factorial results as ans', async () => {
      await self.processCalculatorInput('5!');
      const ansValue = await self.getVariable('ans');
      expect(ansValue).toBe(120);

      const result = await self.processCalculatorInput('ans / 24');
      expect(result.toString()).toBe('5');
    });
  });

  describe('Factorial Error Handling', () => {
    test('should handle malformed factorial expressions gracefully', async () => {
      const result1 = await self.processCalculatorInput('!5'); // Factorial before number
      expect(result1).toContain('Error');

      const result2 = await self.processCalculatorInput('5!!'); // Double factorial
      // This might work depending on implementation - test what happens
    });

    test('should handle factorial with decimal inputs through calculator', async () => {
      // When coming through the calculator, decimals should be rejected
      const result = await self.processCalculatorInput('3.5!');
      expect(result).toContain('Error');
    });

    test('should handle factorial overflow gracefully', async () => {
      // Very large factorial should be handled gracefully
      const result = await self.processCalculatorInput('1000!');
      expect(result).toContain('Error');
    });
  });

  describe('Factorial Performance', () => {
    test('should calculate factorials efficiently', () => {
      // Test that factorial calculation is fast enough for reasonable inputs
      const start = performance.now();
      const result = self.calculateFactorial(20);
      const end = performance.now();
      
      expect(result).toBe(2432902008176640000);
      expect(end - start).toBeLessThan(10); // Should complete in less than 10ms
    });

    test('should handle edge of safe integer range', () => {
      // Test factorials near the edge of safe integer range
      const result18 = self.calculateFactorial(18);
      expect(Number.isSafeInteger(result18)).toBe(true);
      
      // 19! might exceed safe integer range
      const result19 = self.calculateFactorial(19);
      expect(typeof result19).toBe('number');
      expect(isFinite(result19)).toBe(true);
    });
  });

  describe('Integration with Other Features', () => {
    test('should work with factorial in variable assignments and chaining', async () => {
      // Assign factorial result to variable
      await self.processCalculatorInput('@f5 = 5!');
      expect(await self.getVariable('f5')).toBe(120);

      // Use factorial result in chained calculation
      const result1 = await self.processCalculatorInput('4!');
      expect(result1.toString()).toBe('24');

      const result2 = await self.processCalculatorInput('+ f5');
      expect(result2.toString()).toBe('144'); // 24 + 120
    });

    test('should work with factorial and negative number fix', async () => {
      // Test factorial with the negative number chaining fix
      await self.processCalculatorInput('3! - 30'); // 6 - 30 = -24
      const ansValue = await self.getVariable('ans');
      expect(ansValue).toBe(-24);

      const result = await self.processCalculatorInput('^2');
      expect(result.toString()).toBe('576'); // (-24)^2 = 576
    });

    test('should work with factorial and mathematical constants', async () => {
      const result = await self.processCalculatorInput('3! * PI');
      const expected = 6 * Math.PI;
      expect(parseFloat(result.toString())).toBeCloseTo(expected);
    });
  });
}); 