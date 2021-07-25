const { expect } = require('@jest/globals');
const { Type } = require('./Type.js');

const isPrime = (num) => {
  for (var i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
};

describe('Type', () => {
  it('checks type with checker functions', () => {
    const testType = new Type('number & $0', [isPrime]);
    expect(testType.checks(3)).toBe(true);
    expect(testType.checks(4)).toBe(false);
    expect(testType.checks('3')).toBe(false);
  });

  it('checks in type', () => {
    const testType = new Type('in [23, "abc", false]', [isPrime]);
    expect(testType);
    expect(testType.checks(23)).toBe(true);
    expect(testType.checks('abc')).toBe(true);
    expect(testType.checks(true)).toBe(false);
    expect(testType.checks(45)).toBe(false);
    expect(testType.checks(false)).toBe(true);
  });

  it('checks or type', () => {
    const testType = new Type('char | byte');
    expect(testType);
    expect(testType.checks('a')).toBe(true);
    expect(testType.checks('abc')).toBe(false);
    expect(testType.checks(3456)).toBe(false);
    expect(testType.checks(45)).toBe(true);
  });

  it('checks and type and regex type', () => {
    const testType = new Type('number & /^\\d{3}$/'); // preguntar esto
    expect(testType);
    expect(testType.checks('345')).toBe(false);
    expect(testType.checks(345)).toBe(true);
    expect(testType.checks(3456)).toBe(false);
  });

  it('checks int type', () => {
    const testType = new Type('int');
    expect(testType);
    expect(testType.checks('345')).toBe(false);
    expect(testType.checks(345)).toBe(true);
    expect(testType.checks(3.14)).toBe(false);
  });

  it('checks double type', () => {
    const testType = new Type('double');
    expect(testType);
    expect(testType.checks('345')).toBe(false);
    expect(testType.checks(345)).toBe(false);
    expect(testType.checks(3.14)).toBe(true);
    expect(testType.checks(NaN)).toBe(true);
    expect(testType.checks(Infinity)).toBe(true);
    expect(testType.checks(3e-6)).toBe(true);
  });

  it('checks iterable type', () => {
    const testType = new Type('[double, string, ...int]');
    expect(testType);
    expect(testType.checks('34.5')).toBe(false);
    expect(testType.checks(34.5)).toBe(false);
    expect(testType.checks([3.14, 'abc'])).toBe(true);
    expect(testType.checks([3.14, 'abc', 2, 3])).toBe(true);
    expect(testType.checks([3.14, 'abc', 3.14])).toBe(false);
    expect(testType.checks(new Set([3.14, 'abc', 2, 3]))).toBe(true);
    expect(testType.checks(new Set([3.14, 'abc', 'sdsf']))).toBe(false);
  });

  it('checks iterable type', () => {
    const testType = new Type('[...number]');
    expect(testType);
    expect(testType.checks('34.5')).toBe(false);
    expect(testType.checks(34.5)).toBe(false);
    expect(testType.checks([3.14, 'abc'])).toBe(false);
    expect(testType.checks([3.14, 2, 3])).toBe(true);
    expect(testType.checks(['abc'])).toBe(false);
    expect(testType.checks([])).toBe(true);
  });

  it('checks iterable type', () => {
    const testType = new Type('[...]');
    expect(testType);
    expect(testType.checks('34.5')).toBe(true); // esta bien esto?
    expect(testType.checks(34.5)).toBe(false);
    expect(testType.checks([3.14, 'abc'])).toBe(true);
    expect(testType.checks([3.14, 2, 3])).toBe(true);
    expect(testType.checks(['abc'])).toBe(true);
    expect(testType.checks([])).toBe(true);
  });

  it('checks iterable type', () => {
    const testType = new Type('[boolean, ...number]');
    expect(testType);
    expect(testType.checks(34.5)).toBe(false);
    expect(testType.checks([3.14])).toBe(false);
    expect(testType.checks([true])).toBe(true);
    expect(testType.checks(['true'])).toBe(false);
    expect(testType.checks([])).toBe(false);
  });

  it('checks iterable type', () => {
    const testType = new Type('[...[number, string]]');
    expect(testType.checks([[1, 'a']])).toBe(true);
    const m1 = new Map();
    m1.set(1, 'b');
    m1.set(2, 'c');
    expect(testType.checks(m1)).toBe(true);
  });

  it('checks iterable type', () => {
    const testType = new Type('[...3 * number]');
    expect(testType.checks([1, 'a', 2])).toBe(false);
    expect(testType.checks([1, 4, 2])).toBe(true);
    expect(testType.checks([1, 4, 2, 6])).toBe(false);
    expect(testType.checks([1, 4])).toBe(false);
  });

  it('checks object type', () => {
    const testType = new Type(
      '{ prop1: number, prop2: string, .../re/: boolean }'
    );
    expect(testType.checks({ prop1: 1, prop2: 'abc' })).toBe(true);
    expect(testType.checks({ prop1: 1, prop2: 'abc', re: false })).toBe(true);
    expect(testType.checks({ prop1: 1, prop2: 'abc', sdasd: false })).toBe(
      false
    );
    expect(testType.checks({ prop1: 1, prop2: 'abc', re: 3 })).toBe(false);
    expect(testType.checks({ prop1: 1, prop5: 'abc', re: false })).toBe(false);
  });

  it('checks object type', () => {
    const testType = new Type('{ prop1: number, ...}');
    expect(testType.checks({ prop1: 1, prop2: 'abc' })).toBe(true);
    expect(testType.checks({ prop1: 1, prop2: 'abc', re: false })).toBe(true);
    expect(testType.checks({ prop1: '1', prop2: 'abc', sdasd: false })).toBe(
      false
    );
    expect(testType.checks({ prop6: 1, prop2: 'abc', re: 3 })).toBe(false);
  });

  it('checks Array type', () => {
    const testType = new Type('Array<number>');
    expect(testType.checks(new Array(1, 3, 4, 5))).toBe(true);
    expect(testType.checks([1, 3, 3, 5])).toBe(true);
    expect(testType.checks(new Array(1, 3, 4, 'a'))).toBe(false);
  });

  it('checks Set type', () => {
    const testType = new Type('Set<number>');
    expect(testType.checks(new Set([1, 3, 4, 5]))).toBe(true);
    expect(testType.checks(new Set([1, 3, 4, 'a']))).toBe(false);
    expect(testType.checks(new Array([1, 3, 4, 5]))).toBe(false);
  });

  it('checks Map type', () => {
    const testType = new Type('Map<number, string>');
    expect(
      testType.checks(
        new Map([
          [1, 'a'],
          [2, 'b'],
        ])
      )
    ).toBe(true);
    expect(
      testType.checks(
        new Map([
          [1, 'a'],
          [2, 3],
        ])
      )
    ).toBe(false);
    expect(
      testType.checks(
        new Array([
          [1, 'a'],
          [2, 'b'],
        ])
      )
    ).toBe(false);
  });

  it('uses classChecker to check a class', () => {
    class Test {
      constructor(name, id) {
        this.name = name;
        this.id = id;
      }
    }
    const testType = new Type('Test<string>');
    testType.classChecker(Test, (testValue, checkers) => {
      const [elemType] = checkers;
      return checkers.length === 1 && elemType(testValue.name);
    });

    const test1 = new Test('name', 1);
    const test2 = new Test(121, 1);

    expect(testType.checks(test1)).toBe(true);
    expect(testType.checks(test2)).toBe(false);
  });
});
