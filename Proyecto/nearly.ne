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
  times: '*',
  dots: '...',
  checkfuns: /\$\d+/,
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
  inValues: 'in',
  whitespace: { 
    match: /(?: |(?:\n)|(?:\r)|(?:\t))+/, 
    lineBreaks: true 
  },
  number: /(?:\d+)(?:(?:\.\d+))?(?:[Ee](?:[\+-])?(?:\d+))?|Infinity|-Infinity|NaN/,
  regex: /\/(?:[^\r\n\\\/]|\\[^\r\n])+\/[isu]*/,
  string: {
    match: /(?:"(?:.|\n)*?")/,
    lineBreaks: true,
    value: x => x.slice(1, -1),
  },
});

%}

@lexer lexer

type -> %not type {% ([,t1]) => typeObjects.typeNot(t1) %}
type -> type __ %and __ type {% ([t1,,,,t2]) => typeObjects.typeAnd(t1, t2) %}
type -> type __ %or __ type {% ([t1,,,,t2]) => typeObjects.typeOr(t1, t2) %}
type -> type __ %minus __ type {% ([t1,,,,t2]) => typeObjects.typeMinus(t1, t2) %}

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
type -> %checkfuns {% ([value]) => typeObjects.typeCheckFun(+(value.value.slice(1))) %}

type -> valueType {% ([valueType]) => valueType %}

valueType -> %true {% ([value]) => true %}
valueType -> %false {% ([value]) => false %}
valueType -> %number {% ([value]) => +value %}
valueType -> %string {% ([value]) => value.value %}

type -> %inValues __ %lsqBracket params %rsqBracket {% ([,,,params,]) => typeObjects.typeIn(params) %}
params -> m {% ([m]) => m %}
m -> valueType _ %comma _ m {% ([fst,,,,m]) => [fst].concat(m) %}
m -> valueType {% ([fst]) => [fst] %}

type -> %lsqBracket itParams %rsqBracket {% ([,params,]) => typeObjects.typeIterable(params) %}
itParams -> p {% ([p]) => p %}
p -> itType _ %comma _ p {% ([fst,,,,m]) => fst.concat(m) %}
p -> itType {% ([fst]) => fst %}

itType -> type {% ([type]) => [type] %}
itType -> %dots {% ([type]) => [typeObjects.typeAny] %}
itType -> %dots type {%  %}
itType -> %dots /^\d+$/ _ %times _ type {%  %}



# Optional whitespace
_ -> %whitespace:*

# Mandatory whitespace
__ -> %whitespace:+