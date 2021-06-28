const nearley = require('nearley');
const grammar = require('./grammar.js');

const checks = (typeObject, checkFunctions, value) => {
  if (typeof typeObject !== 'object') {
    return typeObject === value;
  }
  switch (typeObject.type) {
    case 'not':
      return !checks(typeObject.right, checkFunctions, value);
    case 'and':
      return checks(typeObject.left, checkFunctions, value) && checks(typeObject.right, checkFunctions, value);
    case 'or':
      return checks(typeObject.left, checkFunctions, value) || checks(typeObject.right, checkFunctions, value);
    case 'minus':
      return checks(typeObject.left, checkFunctions, value) && !checks(typeObject.right, checkFunctions, value);
    case 'in':
      return typeObject.values.includes(value);
    case 'regex':
      return typeObject.regex.test(value);
    case 'checkFun':
      return checkFunctions[typeObject.index].apply(null, [value]);
    case 'iterable':
      let valueIterator;
      if (value instanceof Set) {
        valueIterator = value.values();
      } else if (value instanceof Map) {
        valueIterator = value.entries();
      }
      if (typeof value[Symbol.iterator] !== 'function') return false;
      valueIterator = value[Symbol.iterator]();

      let currentItem = valueIterator.next();
      for (itType of typeObject.types) {
        switch (itType.type) {
          case 'dots':
            if (currentItem.done) break;
            while (checks(itType.value, checkFunctions, currentItem.value)) {
              currentItem = valueIterator.next();
              if (currentItem.done) break;
            }
            break;
          case 'single':
            if (currentItem.done) return false;
            if (!checks(itType.value, checkFunctions, currentItem.value)) return false;
            currentItem = valueIterator.next();
            break;
        }
      }
      return currentItem.done;

 /*      let typeIndex = 0;
      for (item of value) {
        let currentType = typeObject.types[typeIndex];
        let toNextItem = false;
        while (currentType && currentType.type === 'dots') {
          if (checks(currentType.value, checkFunctions, item)) {
            toNextItem = true;
            break;
          } else {
            typeIndex++;
            currentType = typeObject.types[typeIndex];
          }
        }
        if (toNextItem) continue;
        if (currentType && checks(currentType.value, checkFunctions, item)) {
          typeIndex++;
        } else {
          return false;
        }   
      }
      return (typeIndex == typeObject.types.length) || typeObject.types.slice(typeIndex).every((type) => type.type === 'dots'); */
    case 'undefined':
    case 'boolean':
    case 'number':
    case 'string':
    case 'function':
    case 'object':
    case 'symbol':
    case 'bigint':
      return typeObject.type === typeof value;
    case 'void':
      return (typeof value) === 'null' || (typeof value) === 'undefined';
    case 'int':
      const reI = new RegExp(/^(?:\d+)(?:[Ee](?:[\+\-])?(?:\d+))?$/);
      return (typeof value) === 'number' && reI.test(value.toString());
    case 'double':
      const reD = new RegExp(/^((?:\d+)(?:(?:\.\d+))(?:[Ee](?:[\+\-])?(?:\d+))?)$|NaN|Infinity|-Infinity/);
      return (typeof value) === 'number' && reD.test(value.toString());
    case 'char':
      return (typeof value) === 'string' && value.length === 1;
    case 'byte':
      return (typeof value) === 'number' && (value >= 0 && value <= 255);
    case 'any':
    case '_':
      return true;
    default:
      return false;
  }
};

class Type {
  constructor(type, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(type);
    this.parsedType = parser.finish()[0];
    this.checkFunctions = checkFunctions;
  }

  checks(value) {
    return checks(this.parsedType, this.checkFunctions, value);
  }

  demand(value) {
    if (this.checks(value)) {
      return value;
    } else {
      throw new TypeError('El valor no encaja con este tipo');
    }
  }

  classChecker() { }
}

module.exports = Type;

/* Type.classChecker(Set, (setValue, checkers) => {
  const [elemType] = checkers;
  return checkers.length === 1 && [...setValue].all((elem) => elemType(elem));
}); */

