const Type = require('./type.js');

const isPrime = (num) => {
  for (var i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
};

describe('Type', () => {
  it('checks type with checker functions', () => {
    const tipo = new Type('number & $0', [isPrime]);
    expect(tipo.checks(3)).toBe(true);
    expect(tipo.checks(4)).toBe(false);
    expect(tipo.checks('3')).toBe(false);
  });

  it('checks in type', () => {
    const tipo = new Type('in [23, "abc", false]', [isPrime]);
    expect(tipo);
    expect(tipo.checks(23)).toBe(true);
    expect(tipo.checks('abc')).toBe(true);
    expect(tipo.checks(true)).toBe(false);
    expect(tipo.checks(45)).toBe(false);
    expect(tipo.checks(false)).toBe(true);
  });

  it('checks or type', () => {
    const tipo = new Type('char | byte');
    expect(tipo);
    expect(tipo.checks('a')).toBe(true);
    expect(tipo.checks('abc')).toBe(false);
    expect(tipo.checks(3456)).toBe(false);
    expect(tipo.checks(45)).toBe(true);
  });

  it('checks and type and regex type', () => {
    const tipo = new Type('number & /^\\d{3}$/'); // preguntar esto
    expect(tipo);
    expect(tipo.checks('345')).toBe(false);
    expect(tipo.checks(345)).toBe(true);
    expect(tipo.checks(3456)).toBe(false);
  });

  it('checks int type', () => {
    const tipo = new Type('int');
    expect(tipo);
    expect(tipo.checks('345')).toBe(false);
    expect(tipo.checks(345)).toBe(true);
    expect(tipo.checks(3.14)).toBe(false);
  });

  it('checks double type', () => {
    const tipo = new Type('double');
    expect(tipo);
    expect(tipo.checks('345')).toBe(false);
    expect(tipo.checks(345)).toBe(false);
    expect(tipo.checks(3.14)).toBe(true);
    expect(tipo.checks(NaN)).toBe(true);
    expect(tipo.checks(Infinity)).toBe(true);
    expect(tipo.checks(3e-6)).toBe(true);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[double, string, ...int]');
    expect(tipo);
    expect(tipo.checks('34.5')).toBe(false);
    expect(tipo.checks(34.5)).toBe(false);
    expect(tipo.checks([3.14, "abc"])).toBe(true);
    expect(tipo.checks([3.14, "abc", 2, 3])).toBe(true);
    expect(tipo.checks([3.14, "abc", 3.14])).toBe(false);
    expect(tipo.checks(new Set([3.14, "abc", 2, 3]))).toBe(true);
    expect(tipo.checks(new Set([3.14, "abc", "sdsf"]))).toBe(false);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[...number]');
    expect(tipo);
    expect(tipo.checks('34.5')).toBe(false);
    expect(tipo.checks(34.5)).toBe(false);
    expect(tipo.checks([3.14, "abc"])).toBe(false);
    expect(tipo.checks([3.14, 2, 3])).toBe(true);
    expect(tipo.checks(["abc"])).toBe(false);
    expect(tipo.checks([])).toBe(true);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[...]');
    expect(tipo);
    expect(tipo.checks('34.5')).toBe(true); // esta bien esto?
    expect(tipo.checks(34.5)).toBe(false);
    expect(tipo.checks([3.14, "abc"])).toBe(true);
    expect(tipo.checks([3.14, 2, 3])).toBe(true);
    expect(tipo.checks(["abc"])).toBe(true);
    expect(tipo.checks([])).toBe(true);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[boolean, ...number]');
    expect(tipo);
    expect(tipo.checks(34.5)).toBe(false);
    expect(tipo.checks([3.14])).toBe(false);
    expect(tipo.checks([true])).toBe(true);
    expect(tipo.checks(['true'])).toBe(false);
    expect(tipo.checks([])).toBe(false);
  });

  it.skip('checks iterable type', () => {
    const tipo = new Type('[...boolean, boolean]');
    expect(tipo);
    expect(tipo.checks([true])).toBe(true);
    expect(tipo.checks([])).toBe(false);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[...[number, string]]');
    expect(tipo.checks([[1, 'a']])).toBe(true);
    const m1 = new Map();
    m1.set(1, 'b');
    m1.set(2, 'c');
    expect(tipo.checks(m1)).toBe(true);
  });

  it('checks iterable type', () => {
    const tipo = new Type('[...3 * number]');
    expect(tipo.checks([1, 'a', 2])).toBe(false);
    expect(tipo.checks([1, 4, 2])).toBe(true);
    expect(tipo.checks([1, 4, 2, 6])).toBe(false);
    expect(tipo.checks([1, 4])).toBe(false);
  });

  it('checks object type', () => {
    const tipo = new Type('{ prop1: number, prop2: string, .../re/: boolean }');
    expect(tipo.checks({ prop1: 1, prop2: 'abc'})).toBe(true);
    expect(tipo.checks({ prop1: 1, prop2: 'abc', re: false})).toBe(true);
    expect(tipo.checks({ prop1: 1, prop2: 'abc', sdasd: false})).toBe(false);
    expect(tipo.checks({ prop1: 1, prop2: 'abc', re: 3})).toBe(false);
    expect(tipo.checks({ prop1: 1, prop5: 'abc', re: false})).toBe(false);
  });


  it('checks object type', () => {
    const tipo = new Type('{ prop1: number, ...}');
    expect(tipo.checks({ prop1: 1, prop2: 'abc'})).toBe(true);
    expect(tipo.checks({ prop1: 1, prop2: 'abc', re: false})).toBe(true);
    expect(tipo.checks({ prop1: '1', prop2: 'abc', sdasd: false})).toBe(false);
    expect(tipo.checks({ prop6: 1, prop2: 'abc', re: 3})).toBe(false);
  });

  it('checks Array type', () => {
    const tipo = new Type('Array<number>');
    expect(tipo.checks(new Array(1, 3, 4, 5))).toBe(true);
    expect(tipo.checks([1, 3, 3, 5])).toBe(true);
    expect(tipo.checks(new Array(1, 3, 4, 'a'))).toBe(false);
  });

  it('checks Set type', () => {
    const tipo = new Type('Set<number>');
    expect(tipo.checks(new Set([1, 3, 4, 5]))).toBe(true);
    expect(tipo.checks(new Set([1, 3, 4, 'a']))).toBe(false);
    expect(tipo.checks(new Array([1, 3, 4, 5]))).toBe(false);
  });

  it('checks Map type', () => {
    const tipo = new Type('Map<number, string>');
    expect(tipo.checks(new Map([[1, 'a'], [2, 'b']]))).toBe(true);
    expect(tipo.checks(new Map([[1, 'a'], [2, 3]]))).toBe(false);
    expect(tipo.checks(new Array([[1, 'a'], [2, 'b']]))).toBe(false);
  });
});