const { expect } = require('@jest/globals');
const Type = require('./type.js');

const isPrime = (num) => {
  for (var i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
};

describe('Type', () => {
  it('checks type with checker functions', () => {
    const tipo1 = new Type('number & $0', [isPrime]);
    expect(tipo1.checks(3)).toBe(true);
  });
});
