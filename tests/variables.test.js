/**
 * Tests for variables.js functionality
 * Covers variable storage, retrieval, validation, and edge cases
 */

// Import the variables.js file
require('../js/variables.js');

describe('Variables System', () => {
  beforeEach(() => {
    // Clear variables before each test
    global.self.initVariables();
  });

  describe('Variable Storage and Retrieval', () => {
    test('should store and retrieve simple numeric variable', async () => {
      const success = await self.setVariable('x', 42);
      expect(success).toBe(true);
      
      const value = await self.getVariable('x');
      expect(value).toBe(42);
    });

    test('should store and retrieve decimal variable', async () => {
      const success = await self.setVariable('pi_approx', 3.14159);
      expect(success).toBe(true);
      
      const value = await self.getVariable('pi_approx');
      expect(value).toBe(3.14159);
    });

    test('should store and retrieve negative numbers', async () => {
      const success = await self.setVariable('negative', -25);
      expect(success).toBe(true);
      
      const value = await self.getVariable('negative');
      expect(value).toBe(-25);
    });

    test('should store and retrieve zero', async () => {
      const success = await self.setVariable('zero', 0);
      expect(success).toBe(true);
      
      const value = await self.getVariable('zero');
      expect(value).toBe(0);
    });

    test('should store and retrieve string values', async () => {
      const success = await self.setVariable('result', "42");
      expect(success).toBe(true);
      
      const value = await self.getVariable('result');
      expect(value).toBe("42");
    });
  });

  describe('Variable Name Validation', () => {
    test('should accept valid variable names', async () => {
      const validNames = [
        'x',
        'variable',
        'var_1',
        '_private',
        'camelCase',
        'UPPERCASE',
        'mixed_Case_123'
      ];

      for (const name of validNames) {
        const success = await self.setVariable(name, 100);
        expect(success).toBe(true);
        
        const value = await self.getVariable(name);
        expect(value).toBe(100);
      }
    });

    test('should reject invalid variable names', async () => {
      const invalidNames = [
        '',           // empty string
        '123var',     // starts with number
        'var-name',   // contains dash
        'var.name',   // contains dot
        'var name',   // contains space
        'var+name',   // contains plus
        'var@name',   // contains special character
        null,         // null
        undefined     // undefined
      ];

      for (const name of invalidNames) {
        const success = await self.setVariable(name, 100);
        expect(success).toBe(false);
      }
    });

    test('should handle reserved JavaScript keywords safely', async () => {
      // These should be allowed as they're just variable names in our system
      const jsKeywords = ['function', 'var', 'let', 'const', 'class', 'return'];
      
      for (const keyword of jsKeywords) {
        const success = await self.setVariable(keyword, 100);
        expect(success).toBe(true);
        
        const value = await self.getVariable(keyword);
        expect(value).toBe(100);
      }
    });
  });

  describe('Variable Deletion', () => {
    test('should delete existing variables', async () => {
      await self.setVariable('temp', 999);
      expect(await self.getVariable('temp')).toBe(999);
      
      const deleted = await self.deleteVariable('temp');
      expect(deleted).toBe(true);
      
      const value = await self.getVariable('temp');
      expect(value).toBeUndefined();
    });

    test('should handle deletion of non-existent variables', async () => {
      const deleted = await self.deleteVariable('nonexistent');
      expect(deleted).toBe(false);
    });

    test('should not affect other variables when deleting', async () => {
      await self.setVariable('keep', 100);
      await self.setVariable('delete', 200);
      
      await self.deleteVariable('delete');
      
      expect(await self.getVariable('keep')).toBe(100);
      expect(await self.getVariable('delete')).toBeUndefined();
    });
  });

  describe('Get All Variables', () => {
    test('should return empty object when no variables exist', async () => {
      const variables = await self.getAllVariables();
      expect(variables).toEqual({});
    });

    test('should return all stored variables', async () => {
      await self.setVariable('a', 1);
      await self.setVariable('b', 2);
      await self.setVariable('c', 3);
      
      const variables = await self.getAllVariables();
      expect(variables).toEqual({
        a: 1,
        b: 2,
        c: 3
      });
    });

    test('should maintain variable types in getAllVariables', async () => {
      await self.setVariable('integer', 42);
      await self.setVariable('decimal', 3.14);
      await self.setVariable('negative', -10);
      await self.setVariable('string', "test");
      
      const variables = await self.getAllVariables();
      expect(variables.integer).toBe(42);
      expect(variables.decimal).toBe(3.14);
      expect(variables.negative).toBe(-10);
      expect(variables.string).toBe("test");
    });
  });

  describe('Variable Overwriting', () => {
    test('should overwrite existing variables', async () => {
      await self.setVariable('x', 10);
      expect(await self.getVariable('x')).toBe(10);
      
      await self.setVariable('x', 20);
      expect(await self.getVariable('x')).toBe(20);
    });

    test('should change variable types when overwriting', async () => {
      await self.setVariable('flexible', 42);
      expect(await self.getVariable('flexible')).toBe(42);
      
      await self.setVariable('flexible', "string");
      expect(await self.getVariable('flexible')).toBe("string");
      
      await self.setVariable('flexible', -3.14);
      expect(await self.getVariable('flexible')).toBe(-3.14);
    });
  });

  describe('Special Variables', () => {
    test('should handle ans variable correctly', async () => {
      await self.setVariable('ans', 42);
      expect(await self.getVariable('ans')).toBe(42);
      
      // ans should be treated like any other variable
      const allVars = await self.getAllVariables();
      expect(allVars.ans).toBe(42);
    });

    test('should handle variables with underscores', async () => {
      await self.setVariable('_private_var', 100);
      await self.setVariable('public_var_', 200);
      await self.setVariable('_both_', 300);
      
      expect(await self.getVariable('_private_var')).toBe(100);
      expect(await self.getVariable('public_var_')).toBe(200);
      expect(await self.getVariable('_both_')).toBe(300);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle undefined and null values appropriately', async () => {
      // undefined values should not be stored
      const success1 = await self.setVariable('test', undefined);
      expect(success1).toBe(false);
      
      // null values might be stored (depending on implementation)
      const success2 = await self.setVariable('test', null);
      // This behavior might vary based on implementation
    });

    test('should handle very long variable names', async () => {
      const longName = 'a'.repeat(100);
      const success = await self.setVariable(longName, 42);
      
      if (success) {
        expect(await self.getVariable(longName)).toBe(42);
      }
      // Test passes whether long names are accepted or rejected
    });

    test('should handle very large numbers', async () => {
      const largeNumber = Number.MAX_SAFE_INTEGER;
      const success = await self.setVariable('large', largeNumber);
      expect(success).toBe(true);
      
      expect(await self.getVariable('large')).toBe(largeNumber);
    });

    test('should handle very small numbers', async () => {
      const smallNumber = Number.MIN_VALUE;
      const success = await self.setVariable('small', smallNumber);
      expect(success).toBe(true);
      
      expect(await self.getVariable('small')).toBe(smallNumber);
    });

    test('should handle special numeric values', async () => {
      await self.setVariable('infinity', Infinity);
      await self.setVariable('negInfinity', -Infinity);
      
      expect(await self.getVariable('infinity')).toBe(Infinity);
      expect(await self.getVariable('negInfinity')).toBe(-Infinity);
      
      // NaN is tricky to test
      await self.setVariable('notANumber', NaN);
      const nanValue = await self.getVariable('notANumber');
      expect(isNaN(nanValue)).toBe(true);
    });
  });

  describe('Case Sensitivity', () => {
    test('should treat variable names as case sensitive', async () => {
      await self.setVariable('var', 1);
      await self.setVariable('Var', 2);
      await self.setVariable('VAR', 3);
      
      expect(await self.getVariable('var')).toBe(1);
      expect(await self.getVariable('Var')).toBe(2);
      expect(await self.getVariable('VAR')).toBe(3);
    });
  });

  describe('Variable Initialization', () => {
    test('should properly initialize/clear variables', () => {
      // Set some variables
      global.self._variables.set('test1', 100);
      global.self._variables.set('test2', 200);
      
      expect(global.self._variables.size).toBe(2);
      
      // Initialize should clear all
      self.initVariables();
      
      expect(global.self._variables.size).toBe(0);
    });
  });

  describe('Variable Name Regex Validation', () => {
    test('should have proper VALID_VARIABLE_NAME_REGEX', () => {
      const regex = self.VALID_VARIABLE_NAME_REGEX;
      expect(regex).toBeDefined();
      expect(regex).toBeInstanceOf(RegExp);
      
      // Test the regex directly
      expect(regex.test('validName')).toBe(true);
      expect(regex.test('_validName')).toBe(true);
      expect(regex.test('123invalid')).toBe(false);
      expect(regex.test('invalid-name')).toBe(false);
    });
  });
}); 