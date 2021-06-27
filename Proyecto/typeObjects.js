// Singleton? undefined y null
const typeUndefined = {
  type: 'undefined',
};

const typeBoolean = {
  type: 'boolean',
};

const typeNumber = {
  type: 'number',
};

const typeString = {
  type: 'string',
};

const typeFunction = {
  type: 'function',
};

const typeObject = {
  type: 'object',
};

const typeSymbol = {
  type: 'symbol',
};

const typeBigInt = {
  type: 'bigint',
};

const typeVoid = {
  type: 'void',
};

const typeInt = {
  type: 'int',
};

const typeDouble = {
  type: 'double',
};

const typeChar = {
  type: 'char',
};

const typeByte = {
  type: 'byte',
};

const typeAny = {
  type: 'any',
};

const typeNot = (right) => ({
  type: 'not',
  right,
});

const typeAnd = (left, right) => ({
  type: 'and',
  left,
  right,
});

const typeOr = (left, right) => ({
  type: 'or',
  left,
  right,
});

const typeMinus = (left, right) => ({
  type: 'minus',
  left,
  right,
});

const typeIn = (values) => ({
  type: 'in',
  values,
});

const typeRegex = (regex) => ({
  type: 'regex',
  regex,
});

const typeCheckFun = (index) => ({
  type: 'checkFun',
  index,
});

const typeIterable = (types) => ({
  type: 'iterable',
  types,
});

const typeSingleItElement = (value) => ({
  type: 'single',
  value,
});

const typeDotsItElement = (value) => ({
  type: 'dots',
  value,
});

module.exports = {
  typeUndefined,
  typeBoolean,
  typeNumber,
  typeString,
  typeFunction,
  typeObject,
  typeSymbol,
  typeBigInt,
  typeVoid,
  typeInt,
  typeDouble,
  typeChar,
  typeByte,
  typeAny,
  typeNot,
  typeAnd,
  typeOr,
  typeMinus,
  typeIn,
  typeRegex,
  typeCheckFun,
  typeIterable,
  typeSingleItElement,
  typeDotsItElement
};