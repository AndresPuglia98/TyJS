import nearley from 'nearley';
import grammar from './grammar';

// Call recursive
const checks = (type, value) => {
  switch(type) {
    case 'undefined':
    case 'boolean':
    case 'number':
    case 'string':
    case 'function':
    case 'object':
    case 'symbol':
    case 'bigint':
      return type === typeof value;
    case 'void':
      return (typeof value) === 'null' || (typeof value) === 'undefined';
    case 'int':
      const reI = new RegExp(/(?:\d+)(?:[Ee](?:[\+\-])?(?:\d+))?/);
      return (typeof value) === 'number' && reI.test(value.toString());
    case 'double':
      const reD = new RegExp(/((?:\d+)(?:(?:\.\d+))(?:[Ee](?:[\+\-])?(?:\d+))?)|"NaN"|Infinity|-Infinity/);
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
  }

  checks(value) {
    return checks(this.parsedType.type, value);
  }

  demand() {}

  classChecker() {}
}
