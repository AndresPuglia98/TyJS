@{%
import * as typeObjects from './typeObjects'
import moo from 'moo'
// const moo = require('moo');

const lexer = moo.compile({
  whitespace: { match: /(?: |(?:\n)|(?:\r)|(?:\t))+/, lineBreaks: true },
  number: /(?:\d+)(?:(?:\.\d+))?(?:[Ee](?:[\+\-])?(?:\d+))?/,
  comma: ',',
  true: 'true',
  false: 'false',
  not: '!',
  and: '&',
  or: '|',
  lcurlBracket: '{',
  rcurlBracket: '}',
  lsqBracket: '[',
  rsqBracket: ']',
  typeUndefined: 'undefined'
  typeBoolean: 'boolean'
  typeNumber: 'number'
  typeString: 'string'
  typeFunction: 'function'
  typeObject: 'object'
  typeSymbol: 'symbol'
  typeBigInt: 'bigint'
  typeVoid: 'void'
  typeInt: 'int'
  typeDouble: 'double'
  typeChar: 'char'
  typeByte: 'byte'
  typeAny: 'any'

});

%}

@lexer lexer

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
