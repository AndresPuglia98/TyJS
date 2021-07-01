const nearley = require('nearley');
const grammar = require('../nearley/grammar.js');
const utils = require('./utils');

const globalClassCheckers = new Map();
globalClassCheckers.set('Array', {
  class: Array,
  checker: (arrayValue, checkers) => {
    const [elemType] = checkers;
    return checkers.length === 1 && arrayValue.every(elemType);
  },
});

globalClassCheckers.set('Set', {
  class: Set,
  checker: (setValue, checkers) => {
    const [elemType] = checkers;
    return checkers.length === 1 && [...setValue].every(elemType);
  },
});

globalClassCheckers.set('Map', {
  class: Map,
  checker: (mapValue, checkers) => {
    const [keyType, valueType] = checkers;
    return (
      checkers.length === 2 &&
      [...mapValue.keys()].every(keyType) &&
      [...mapValue.values()].every(valueType)
    );
  },
});

class Type {
  constructor(type, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(type);
    this.parsedType = parser.finish()[0];
    this.checkFunctions = checkFunctions;
    this.classCheckers = new Map(globalClassCheckers);
  }
  /**
   *
   * @param {any} value Any value
   * @returns {boolean} true if <value> fits with the object that it represents.
   */
  checks(value) {
    return utils.checks(this, value);
  }
  /**
   *
   * @param {any} value
   * @returns {any}     <value> if <value> fits with the object that it represents.
   */
  demand(value) {
    if (this.checks(value)) {
      return value;
    } else {
      throw new TypeError('Value does not match with this type.');
    }
  }
  /**
   *
   * @param {function} clazz
   * @param {function} checker
   */
  classChecker(clazz, checker) {
    this.classCheckers.set(clazz.name, {
      class: clazz,
      checker,
    });
  }
  /**
   *
   * @param {function} clazz
   * @param {function} checker
   */
  static classChecker(clazz, checker) {
    globalClassCheckers.set(clazz.name, {
      class: clazz,
      checker,
    });
  }
}

/**
 *
 * @param {string} typeName
 * @returns {Type}          Instance of Type class corresponding with <typeName>.
 */
const type = (typeName) => {
  return new Type(typeName);
};

module.exports = { Type, type };
