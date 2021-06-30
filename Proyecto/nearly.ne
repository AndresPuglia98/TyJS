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
  colon: ':',
  dotsInt: /\.\.\.\d+/,
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
  classIdentifier: /[A-Z][_$A-Za-z0-9\xA0-\uFFFF]*/,
  identifier: /(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$A-Za-z\xA0-\uFFFF][_$A-Za-z0-9\xA0-\uFFFF]+/,
  whitespace: { 
    match: /(?: |(?:\n)|(?:\r)|(?:\t))+/, 
    lineBreaks: true 
  },
  number: /(?:\d+)(?:(?:\.\d+))?(?:[Ee](?:[\+-])?(?:\d+))?|Infinity|-Infinity|NaN/,
  regex: {
    match: /\/(?:[^\r\n\\\/]|\\[^\r\n])+\/[isu]*/,
    value: x => x.slice(1, -1),
  },
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
type -> %classIdentifier {% ([value]) => typeObjects.typeClass(value.value) %}

type -> valueType {% ([valueType]) => valueType %}

valueType -> %true {% ([value]) => true %}
valueType -> %false {% ([value]) => false %}
valueType -> %number {% ([value]) => +value %}
valueType -> %string {% ([value]) => value.value %}

type -> %inValues __ %lsqBracket params %rsqBracket {% ([,,,params,]) => typeObjects.typeIn(params) %}
params -> m {% ([m]) => m %}
m -> valueType _ %comma _ m {% ([fst,,,,m]) => [fst].concat(m) %}
m -> valueType {% ([fst]) => [fst] %}

type -> %lsqBracket _ itParams _ %rsqBracket {% ([,,params,,]) => typeObjects.typeIterable(params) %}
itParams -> p {% ([p]) => p %}
p -> itType _ %comma _ p {% ([fst,,,,m]) => fst.concat(m) %}
p -> itType {% ([fst]) => fst %}

itType -> %dotsInt _ %times _ type {% ([n,,,,type]) => Array(+n.value.slice(3)).fill(typeObjects.typeSingleItElement(type)) %}
itType -> %dots {% ([type]) => [typeObjects.typeDotsItElement(typeObjects.typeAny)] %}
itType -> %dots type {% ([,type]) => [typeObjects.typeDotsItElement(type)] %}
itType -> type {% ([type]) => [typeObjects.typeSingleItElement(type)] %}

type -> %lcurlBracket _ props _ %rcurlBracket {% ([,,props,,]) => typeObjects.typeObj(props) %}
props -> pl {% ([p]) => p %}
pl -> prop _ %comma _ pl {% ([fst,,,,m]) => fst.concat(m) %}
pl -> prop {% ([fst]) => fst %}

prop -> %dotsInt _ %times _ objProp {% ([n,,,,objProp]) => Array(+n.value.slice(3)).fill(typeObjects.typeSingleObjElement(objProp)) %}
prop -> %dots {% ([objProp]) => [] %}
prop -> %dots objProp {% ([,objProp]) => [typeObjects.typeDotsObjElement(objProp)] %}
prop -> objProp {% ([objProp]) => [typeObjects.typeSingleObjElement(objProp)] %}

objProp -> %identifier _ %colon _ type {% ([key,,,,type]) => typeObjects.typeNameProp(key.value, type) %}
objProp -> %regex _ %colon _ type {% ([key,,,,type]) => typeObjects.typeRegexProp(new RegExp(key), type) %}


# Optional whitespace
_ -> %whitespace:*

# Mandatory whitespace
__ -> %whitespace:+