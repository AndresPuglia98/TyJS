// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "type", "symbols": [(lexer.has("not") ? {type: "not"} : not), "type"], "postprocess": ([,t1]) => typeObjects.typeNot(t1)},
    {"name": "type", "symbols": ["type", "__", (lexer.has("and") ? {type: "and"} : and), "__", "type"], "postprocess": ([t1,,,,t2]) => typeObjects.typeAnd(t1, t2)},
    {"name": "type", "symbols": ["type", "__", (lexer.has("or") ? {type: "or"} : or), "__", "type"], "postprocess": ([t1,,,,t2]) => typeObjects.typeOr(t1, t2)},
    {"name": "type", "symbols": ["type", "__", (lexer.has("minus") ? {type: "minus"} : minus), "__", "type"], "postprocess": ([t1,,,,t2]) => typeObjects.typeMinus(t1, t2)},
    {"name": "type", "symbols": [(lexer.has("typeUndefined") ? {type: "typeUndefined"} : typeUndefined)], "postprocess": ([value]) => typeObjects.typeUndefined},
    {"name": "type", "symbols": [(lexer.has("typeBoolean") ? {type: "typeBoolean"} : typeBoolean)], "postprocess": ([value]) => typeObjects.typeBoolean},
    {"name": "type", "symbols": [(lexer.has("typeNumber") ? {type: "typeNumber"} : typeNumber)], "postprocess": ([value]) => typeObjects.typeNumber},
    {"name": "type", "symbols": [(lexer.has("typeString") ? {type: "typeString"} : typeString)], "postprocess": ([value]) => typeObjects.typeString},
    {"name": "type", "symbols": [(lexer.has("typeFunction") ? {type: "typeFunction"} : typeFunction)], "postprocess": ([value]) => typeObjects.typeFunction},
    {"name": "type", "symbols": [(lexer.has("typeObject") ? {type: "typeObject"} : typeObject)], "postprocess": ([value]) => typeObjects.typeObject},
    {"name": "type", "symbols": [(lexer.has("typeSymbol") ? {type: "typeSymbol"} : typeSymbol)], "postprocess": ([value]) => typeObjects.typeSymbol},
    {"name": "type", "symbols": [(lexer.has("typeBigInt") ? {type: "typeBigInt"} : typeBigInt)], "postprocess": ([value]) => typeObjects.typeBigInt},
    {"name": "type", "symbols": [(lexer.has("typeVoid") ? {type: "typeVoid"} : typeVoid)], "postprocess": ([value]) => typeObjects.typeVoid},
    {"name": "type", "symbols": [(lexer.has("typeInt") ? {type: "typeInt"} : typeInt)], "postprocess": ([value]) => typeObjects.typeInt},
    {"name": "type", "symbols": [(lexer.has("typeDouble") ? {type: "typeDouble"} : typeDouble)], "postprocess": ([value]) => typeObjects.typeDouble},
    {"name": "type", "symbols": [(lexer.has("typeChar") ? {type: "typeChar"} : typeChar)], "postprocess": ([value]) => typeObjects.typeChar},
    {"name": "type", "symbols": [(lexer.has("typeByte") ? {type: "typeByte"} : typeByte)], "postprocess": ([value]) => typeObjects.typeByte},
    {"name": "type", "symbols": [(lexer.has("typeAny") ? {type: "typeAny"} : typeAny)], "postprocess": ([value]) => typeObjects.typeAny},
    {"name": "type", "symbols": [(lexer.has("regex") ? {type: "regex"} : regex)], "postprocess": ([value]) => typeObjects.typeRegex(new RegExp(value))},
    {"name": "type", "symbols": [(lexer.has("checkfuns") ? {type: "checkfuns"} : checkfuns)], "postprocess": ([value]) => typeObjects.typeCheckFun(+(value.value.slice(1)))},
    {"name": "type", "symbols": ["valueType"], "postprocess": ([valueType]) => valueType},
    {"name": "valueType", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": ([value]) => true},
    {"name": "valueType", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": ([value]) => false},
    {"name": "valueType", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => +value},
    {"name": "valueType", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([value]) => value.value},
    {"name": "type", "symbols": [(lexer.has("inValues") ? {type: "inValues"} : inValues), "__", (lexer.has("lsqBracket") ? {type: "lsqBracket"} : lsqBracket), "params", (lexer.has("rsqBracket") ? {type: "rsqBracket"} : rsqBracket)], "postprocess": ([,,,params,]) => typeObjects.typeIn(params)},
    {"name": "params", "symbols": ["m"], "postprocess": ([m]) => m},
    {"name": "m", "symbols": ["valueType", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "m"], "postprocess": ([fst,,,,m]) => [fst].concat(m)},
    {"name": "m", "symbols": ["valueType"], "postprocess": ([fst]) => [fst]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]}
]
  , ParserStart: "type"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
