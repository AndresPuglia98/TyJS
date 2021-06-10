import nearley from 'nearley';
import grammar from './grammar';

// Call recursive
const checks = (type, value) => {
  // e.g, type 'and' check components with recursive call
};

class Type {
  constructor(type, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(type);
    this.parsedType = parser.finish()[0];
  }

  checks(value) {
    switch (this.parsedType.type) {
      case '':
        //   checkTypeOf()
        break;

      default:
        break;
    }
  }

  demand() {}

  classChecker() {}
}
