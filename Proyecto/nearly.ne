@{%
const typeObjects = require('./typeObjects.js');
const moo = require('moo');

const lexer = moo.compile({
  comma: ',',
  true: 'true',
  false: 'false',
  not: '!',
  and: '&',
  or: '|',
  minus: '-',
  lcurlBracket: '{',
  rcurlBracket: '}',
  lsqBracket: '[',
  rsqBracket: ']',
  checkfuns: /\$\d+$/u,
  _in: 'in',
  typeUndefined: 'undefined',
  typeBoolean: 'boolean',
  typeNumber: 'number',
  typeString: 'string',
  typeFunction: 'function',
  typeObject: 'object',
  typeSymbol: 'symbol',
  typeBigInt: 'bigint',
  typeVoid: 'void',
  typeInt: 'int',
  typeDouble: 'double',
  typeChar: 'char',
  typeByte: 'byte',
  typeAny: 'any',
  whitespace: { 
    match: /(?: |(?:\n)|(?:\r)|(?:\t))+/u, 
    lineBreaks: true 
  },
  number: /(?:\d+)(?:(?:\.\d+))?(?:[Ee](?:[\+\-])?(?:\d+))?|Infinity|-Infinity|NaN/u,
  regex: /\/(?:[^\r\n\\\/]|\\[^\r\n])+\/[isu]*/u,
  string: {
    match: /(?:"(?:.|\\\n)*?")/u,
    lineBreaks: true,
  },
});

%}

@lexer lexer

type -> %not type {% ([,t1]) => typeObjects.typeNot(t1) %}
type -> type __ %and __ type {% ([t1,,,,t2]) => typeObjects.typeAnd(t1, t2) %}
type -> type __ %or __ type {% ([t1,,,,t2]) => typeObjects.typeAnd(t1, t2) %}
type -> type __ %minus __ type {% ([t1,,,,t2]) => typeObjects.typeAnd(t1, t2) %}

type -> %typeUndefined {% ([value]) => typeObjects.typeUndefined %}
type -> %typeBoolean {% ([value]) => typeObjects.typeBoolean %}
type -> %typeNumber {% ([value]) => typeObjects.typeNumber %}
type -> %typeString {% ([value]) => typeObjects.typeString %}
type -> %typeFunction {% ([value]) => typeObjects.typeFunction %}
type -> %typeObject {% ([value]) => typeObjects.typeObject %}
type -> %typeSymbol {% ([value]) => typeObjects.typeSymbol %}
type -> %typeBigInt {% ([value]) => typeObjects.typeBigInt %}
type -> %typeVoid {% ([value]) => typeObjects.typeVoid %}
type -> %typeInt {% ([value]) => typeObjects.typeInt %}
type -> %typeDouble {% ([value]) => typeObjects.typeDouble %}
type -> %typeChar {% ([value]) => typeObjects.typeChar %}
type -> %typeByte {% ([value]) => typeObjects.typeByte %}
type -> %typeAny {% ([value]) => typeObjects.typeAny %}
type -> %regex {% ([value]) => typeObjects.typeRegex(new RegExp(value)) %}
type -> %checkfuns {% ([value]) => typeObjects.typeCheckFun(+(value.slice(1))) %}

type -> valueType {% ([valueType]) => valueType %}

valueType -> %true {% id %}
valueType -> %false {% id %}
valueType -> %number {% id %}
valueType -> %string {% id %}

type -> %_in __ %lsqBracket params %rsqBracket {% ([,,,params,]) => typeObjects.typeIn(params) %}
params -> m {% ([m]) => m %}
m -> valueType _ %comma _ m {% ([fst,,,,m]) => [fst].concat(m) %}
m -> valueType {% ([fst]) => [fst] %}



# Optional whitespace
_ -> %whitespace:*

# Mandatory whitespace
__ -> %whitespace:+