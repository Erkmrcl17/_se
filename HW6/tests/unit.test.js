
const { validateTodo } = require('../src/todoUtils');

describe('validateTodo', () => {
  test('accepts a valid title', () => {
    expect(validateTodo('Finish homework')).toBe(true);
  });

  test('rejects an empty title', () => {
    expect(validateTodo('')).toBe(false);
  });

  test('rejects whitespace-only title', () => {
    expect(validateTodo('   ')).toBe(false);
  });

  test('rejects non-string values', () => {
    expect(validateTodo(123)).toBe(false);
  });
});
