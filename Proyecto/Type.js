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
      } else if (typeof value[Symbol.iterator] === 'function') {
        valueIterator = value[Symbol.iterator]();
      } else {
        return false;
      }

      let currentItem = valueIterator.next();
      for (const itType of typeObject.types) {
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
    case 'obj':
      if (typeof value !== 'object') return false;
      let objValueIterator = Object.entries(value)[Symbol.iterator]();

      let currentProp = objValueIterator.next();
      for (const prop of typeObject.props) {
        switch (prop.type) {
          case 'dots':
            if (currentProp.done) break;
            while (checks(prop.value, checkFunctions, currentProp.value)) {
              currentProp = objValueIterator.next();
              if (currentProp.done) break;
            }
            break;
          case 'single':
            if (currentProp.done) return false;
            if (!checks(prop.value, checkFunctions, currentProp.value)) return false;
            currentProp = objValueIterator.next();
            break;
        }
      }
      return currentProp.done;
    case 'nameprop':
      return typeObject.propName === value[0] && checks(typeObject.value, checkFunctions, value[1]);
    case 'regexprop':
      return typeObject.propRegex.test(value[0]) && checks(typeObject.value, checkFunctions, value[1]);
    case 'class':
      return value instanceof globalThis[typeObject.className];
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

