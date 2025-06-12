/**
 * Comprehensive tests for calculator.js
 * Focus on negative number parsing fix and core calculator functionality
 */

// Import the calculator and variables modules
require('../js/variables.js');
require('../js/calculator.js');

describe('Calculator Core Functionality', () => {
  beforeEach(() => {
    // Ensure clean state for each test
    global.self.initVariables();
  });

  describe('Basic Arithmetic Operations', () => {
    test('should handle simple addition', async () => {
      const result = await self.processCalculatorInput('5+3');
      expect(result.toString()).toBe('8');
    });

    test('should handle simple subtraction', async () => {
      const result = await self.processCalculatorInput('10-3');
      expect(result.toString()).toBe('7');
    });

    test('should handle simple multiplication', async () => {
      const result = await self.processCalculatorInput('4*5');
      expect(result.toString()).toBe('20');
    });

    test('should handle simple division', async () => {
      const result = await self.processCalculatorInput('15/3');
      expect(result.toString()).toBe('5');
    });

    test('should handle power operations', async () => {
      const result = await self.processCalculatorInput('2^3');
      expect(result.toString()).toBe('8');
    });
  });

  describe('Negative Number Parsing Fix', () => {
    describe('Chained Calculations with Negative Results', () => {
      test('should correctly handle 1-10 then ^2 (main fix scenario)', async () => {
        // First calculation: 1-10 should give -9
        const result1 = await self.processCalculatorInput('1-10');
        expect(result1.toString()).toBe('-9');
        
        // Second calculation: ^2 should give 81 (not -81)
        const result2 = await self.processCalculatorInput('^2');
        expect(result2.toString()).toBe('81');
      });

      test('should handle negative result followed by multiplication', async () => {
        const result1 = await self.processCalculatorInput('5-8');
        expect(result1.toString()).toBe('-3');
        
        const result2 = await self.processCalculatorInput('*3');
        expect(result2.toString()).toBe('-9');
      });

      test('should handle negative result followed by addition', async () => {
        const result1 = await self.processCalculatorInput('2-7');
        expect(result1.toString()).toBe('-5');
        
        const result2 = await self.processCalculatorInput('+5');
        expect(result2.toString()).toBe('0');
      });

      test('should handle negative result followed by power operation', async () => {
        const result1 = await self.processCalculatorInput('0-4');
        expect(result1.toString()).toBe('-4');
        
        const result2 = await self.processCalculatorInput('^3');
        expect(result2.toString()).toBe('-64');
      });

      test('should handle negative result with even power', async () => {
        const result1 = await self.processCalculatorInput('1-3');
        expect(result1.toString()).toBe('-2');
        
        const result2 = await self.processCalculatorInput('^2');
        expect(result2.toString()).toBe('4');
      });
    });

    describe('Direct Negative Number Operations', () => {
      test('should handle negative number multiplication without parentheses', async () => {
        const result = await self.processCalculatorInput('-9*-9');
        expect(result.toString()).toBe('81');
      });

      test('should handle mixed positive/negative multiplication', async () => {
        const result1 = await self.processCalculatorInput('-5*3');
        expect(result1.toString()).toBe('-15');
        
        const result2 = await self.processCalculatorInput('4*-2');
        expect(result2.toString()).toBe('-8');
      });

      test('should preserve existing parentheses functionality', async () => {
        const result1 = await self.processCalculatorInput('(-9)*(-9)');
        expect(result1.toString()).toBe('81');
        
        const result2 = await self.processCalculatorInput('(-9)^2');
        expect(result2.toString()).toBe('81');
      });
    });

    describe('Edge Cases', () => {
      test('should handle zero results in chained calculations', async () => {
        const result1 = await self.processCalculatorInput('5-5');
        expect(result1.toString()).toBe('0');
        
        const result2 = await self.processCalculatorInput('+10');
        expect(result2.toString()).toBe('10');
      });

      test('should handle positive results in chained calculations', async () => {
        const result1 = await self.processCalculatorInput('8-3');
        expect(result1.toString()).toBe('5');
        
        const result2 = await self.processCalculatorInput('*2');
        expect(result2.toString()).toBe('10');
      });

      test('should handle decimal negative numbers', async () => {
        const result1 = await self.processCalculatorInput('1.5-3.7');
        expect(parseFloat(result1.toString())).toBeCloseTo(-2.2);
        
        const result2 = await self.processCalculatorInput('^2');
        expect(parseFloat(result2.toString())).toBeCloseTo(4.84);
      });
    });
  });

  describe('Variable Assignment and Usage', () => {
    test('should handle variable assignment', async () => {
      const result = await self.processCalculatorInput('@x = 5');
      expect(result).toContain('Variable \'x\' set to 5');
      
      const xValue = await self.getVariable('x');
      expect(xValue).toBe(5);
    });

    test('should handle variable usage in calculations', async () => {
      await self.processCalculatorInput('@x = 10');
      const result = await self.processCalculatorInput('x + 5');
      expect(result.toString()).toBe('15');
    });

    test('should handle complex variable expressions', async () => {
      const result = await self.processCalculatorInput('@result = 2 * 3 + 4');
      expect(result).toContain('Variable \'result\' set to 10');
    });

    test('should reject invalid variable names', async () => {
      const result = await self.processCalculatorInput('@123invalid = 5');
      expect(result).toContain('Error: Invalid variable name');
    });
  });

  describe('Factorial Operations', () => {
    test('should handle factorial notation', async () => {
      const result = await self.processCalculatorInput('5!');
      expect(result.toString()).toBe('120');
    });

    test('should handle factorial function call', async () => {
      const result = await self.processCalculatorInput('factorial(5)');
      expect(result.toString()).toBe('120');
    });

    test('should handle zero factorial', async () => {
      const result = await self.processCalculatorInput('0!');
      expect(result.toString()).toBe('1');
    });

    test('should handle factorial in expressions', async () => {
      const result = await self.processCalculatorInput('2 * 3!');
      expect(result.toString()).toBe('12');
    });

    test('should reject negative factorial', async () => {
      const result = await self.processCalculatorInput('factorial(-1)');
      expect(result).toContain('Error');
    });
  });

  describe('Mathematical Constants', () => {
    test('should handle PI constant (uppercase)', async () => {
      const result = await self.processCalculatorInput('PI * 2');
      expect(parseFloat(result.toString())).toBeCloseTo(Math.PI * 2);
    });

    test('should handle pi constant (lowercase)', async () => {
      const result = await self.processCalculatorInput('pi * 2');
      expect(parseFloat(result.toString())).toBeCloseTo(Math.PI * 2);
    });

    test('should handle mixed case pi', async () => {
      const result = await self.processCalculatorInput('Pi * 2');
      expect(parseFloat(result.toString())).toBeCloseTo(Math.PI * 2);
    });
  });

  describe('Answer Storage and Retrieval', () => {
    test('should store result as ans variable', async () => {
      await self.processCalculatorInput('10 + 5');
      const ansValue = await self.getVariable('ans');
      expect(ansValue).toBe(15);
    });

    test('should use ans in subsequent calculations', async () => {
      await self.processCalculatorInput('10');
      const result = await self.processCalculatorInput('ans * 2');
      expect(result.toString()).toBe('20');
    });

    test('should handle ans with negative values', async () => {
      await self.processCalculatorInput('5 - 10');
      const ansValue = await self.getVariable('ans');
      expect(ansValue).toBe(-5);
      
      const result = await self.processCalculatorInput('ans^2');
      expect(result.toString()).toBe('25');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid expressions gracefully', async () => {
      const result = await self.processCalculatorInput('2 +* 3');
      expect(result).toContain('Error');
    });

    test('should handle division by zero', async () => {
      const result = await self.processCalculatorInput('5/0');
      expect(result.toString()).toBe('Infinity');
    });

    test('should handle empty input', async () => {
      const result = await self.processCalculatorInput('');
      expect(result).toContain('Error');
    });

    test('should handle null input', async () => {
      const result = await self.processCalculatorInput(null);
      expect(result).toContain('Error: Invalid input type');
    });
  });

  describe('History Tracking', () => {
    test('should add calculations to history', async () => {
      await self.processCalculatorInput('5 + 3');
      const history = await self.getHistory();
      
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        expression: '5 + 3',
        result: '8'
      });
    });

    test('should track variable assignments in history', async () => {
      await self.processCalculatorInput('@x = 10');
      const history = await self.getHistory();
      
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('@x = 10');
      expect(history[0].result).toContain('Variable \'x\' set to 10');
    });
  });

  describe('Input Preprocessing', () => {
    test('should remove commas from input', async () => {
      const result = await self.processCalculatorInput('1,000 + 2,500');
      expect(result.toString()).toBe('3500');
    });

    test('should handle whitespace variations', async () => {
      const result1 = await self.processCalculatorInput('5+3');
      const result2 = await self.processCalculatorInput('5 + 3');
      const result3 = await self.processCalculatorInput('  5  +  3  ');
      
      expect(result1.toString()).toBe('8');
      expect(result2.toString()).toBe('8');
      expect(result3.toString()).toBe('8');
    });
  });
});

describe('Integration Tests', () => {
  beforeEach(() => {
    global.self.initVariables();
  });

  test('should handle complex chained calculations with variables', async () => {
    // Set up variables
    await self.processCalculatorInput('@base = 10');
    await self.processCalculatorInput('@offset = 15');
    
    // Perform calculation that results in negative number
    const result1 = await self.processCalculatorInput('base - offset');
    expect(result1.toString()).toBe('-5');
    
    // Chain calculation that should square the negative result
    const result2 = await self.processCalculatorInput('^2');
    expect(result2.toString()).toBe('25');
    
    // Use the result in another calculation
    const result3 = await self.processCalculatorInput('+ base');
    expect(result3.toString()).toBe('35');
  });

  test('should handle mixed factorial and negative number operations', async () => {
    // Calculate factorial
    const result1 = await self.processCalculatorInput('4!');
    expect(result1.toString()).toBe('24');
    
    // Subtract to get negative
    const result2 = await self.processCalculatorInput('- 30');
    expect(result2.toString()).toBe('-6');
    
    // Square the negative result
    const result3 = await self.processCalculatorInput('^2');
    expect(result3.toString()).toBe('36');
  });

  test('should maintain precision across multiple operations', async () => {
    const result1 = await self.processCalculatorInput('1/3');
    const decimal = parseFloat(result1.toString());
    expect(decimal).toBeCloseTo(0.3333333333333333);
    
    const result2 = await self.processCalculatorInput('*3');
    expect(parseFloat(result2.toString())).toBeCloseTo(1);
  });
});

describe('Performance and Edge Cases', () => {
  test('should handle very large numbers', async () => {
    const result = await self.processCalculatorInput('999999999 * 999999999');
    expect(typeof parseFloat(result.toString())).toBe('number');
    expect(isFinite(parseFloat(result.toString()))).toBe(true);
  });

  test('should handle very small decimal numbers', async () => {
    const result = await self.processCalculatorInput('0.000001 * 0.000001');
    expect(typeof parseFloat(result.toString())).toBe('number');
  });

  test('should handle multiple sequential operations', async () => {
    const operations = [
      '100',
      '-50',
      '/2',
      '+10',
      '^2',
      '-100'
    ];
    
    let lastResult;
    for (const op of operations) {
      lastResult = await self.processCalculatorInput(op);
    }
    
    // (((100-50)/2)+10)^2-100 = ((50/2)+10)^2-100 = (25+10)^2-100 = 35^2-100 = 1225-100 = 1125
    expect(lastResult.toString()).toBe('1125');
  });
}); 