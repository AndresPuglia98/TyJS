/**
 *
 * @param {Type} type  Instance of class Type
 * @param {any} value  Value to check
 * @returns
 */
const checks = (type, value) => {
  const { parsedType: typeObject, checkFunctions, classCheckers } = type;
  if (typeof typeObject !== 'object') {
    return typeObject === value;
  }
  switch (typeObject.type) {
    case 'not':
      return !checks(
        { parsedType: typeObject.right, checkFunctions, classCheckers },
        value
      );
    case 'and':
      return (
        checks(
          { parsedType: typeObject.left, checkFunctions, classCheckers },
          value
        ) &&
        checks(
          { parsedType: typeObject.right, checkFunctions, classCheckers },
          value
        )
      );
    case 'or':
      return (
        checks(
          { parsedType: typeObject.left, checkFunctions, classCheckers },
          value
        ) ||
        checks(
          { parsedType: typeObject.right, checkFunctions, classCheckers },
          value
        )
      );
    case 'minus':
      return (
        checks(
          { parsedType: typeObject.left, checkFunctions, classCheckers },
          value
        ) &&
        !checks(
          { parsedType: typeObject.right, checkFunctions, classCheckers },
          value
        )
      );
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
            while (
              checks(
                { parsedType: itType.value, checkFunctions, classCheckers },
                currentItem.value
              )
            ) {
              currentItem = valueIterator.next();
              if (currentItem.done) break;
            }
            break;
          case 'single':
            if (currentItem.done) return false;
            if (
              !checks(
                { parsedType: itType.value, checkFunctions, classCheckers },
                currentItem.value
              )
            )
              return false;
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
            while (
              checks(
                { parsedType: prop.value, checkFunctions, classCheckers },
                currentProp.value
              )
            ) {
              currentProp = objValueIterator.next();
              if (currentProp.done) break;
            }
            break;
          case 'single':
            if (currentProp.done) return false;
            if (
              !checks(
                { parsedType: prop.value, checkFunctions, classCheckers },
                currentProp.value
              )
            )
              return false;
            currentProp = objValueIterator.next();
            break;
        }
      }
      return currentProp.done;
    case 'nameprop':
      return (
        typeObject.propName === value[0] &&
        checks(
          { parsedType: typeObject.value, checkFunctions, classCheckers },
          value[1]
        )
      );
    case 'regexprop':
      return (
        typeObject.propRegex.test(value[0]) &&
        checks(
          { parsedType: typeObject.value, checkFunctions, classCheckers },
          value[1]
        )
      );
    case 'class':
      const classCheckerValue = classCheckers.get(typeObject.className);
      return (
        value instanceof classCheckerValue.class &&
        classCheckerValue.checker(
          value,
          typeObject.args.map(
            (subtype) => (v) =>
              checks({ parsedType: subtype, checkFunctions, classCheckers }, v)
          )
        )
      );
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
      return value === null || value === undefined;
    case 'int':
      const reI = new RegExp(/^(?:\d+)(?:[Ee](?:[\+\-])?(?:\d+))?$/);
      return typeof value === 'number' && reI.test(value.toString());
    case 'double':
      const reD = new RegExp(
        /^((?:\d+)(?:(?:\.\d+))(?:[Ee](?:[\+\-])?(?:\d+))?)$|NaN|Infinity|-Infinity/
      );
      return typeof value === 'number' && reD.test(value.toString());
    case 'char':
      return typeof value === 'string' && value.length === 1;
    case 'byte':
      return typeof value === 'number' && value >= 0 && value <= 255;
    case 'any':
    case '_':
      return true;
    default:
      return false;
  }
};

module.exports = { checks };
