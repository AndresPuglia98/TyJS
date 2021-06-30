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
    {"name": "type", "symbols": [(lexer.has("classIdentifier") ? {type: "classIdentifier"} : classIdentifier)], "postprocess": ([value]) => typeObjects.typeClass(value.value)},
    {"name": "type", "symbols": ["valueType"], "postprocess": ([valueType]) => valueType},
    {"name": "valueType", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": ([value]) => true},
    {"name": "valueType", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": ([value]) => false},
    {"name": "valueType", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => +value},
    {"name": "valueType", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([value]) => value.value},
    {"name": "type", "symbols": [(lexer.has("inValues") ? {type: "inValues"} : inValues), "__", (lexer.has("lsqBracket") ? {type: "lsqBracket"} : lsqBracket), "params", (lexer.has("rsqBracket") ? {type: "rsqBracket"} : rsqBracket)], "postprocess": ([,,,params,]) => typeObjects.typeIn(params)},
    {"name": "params", "symbols": ["m"], "postprocess": ([m]) => m},
    {"name": "m", "symbols": ["valueType", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "m"], "postprocess": ([fst,,,,m]) => [fst].concat(m)},
    {"name": "m", "symbols": ["valueType"], "postprocess": ([fst]) => [fst]},
    {"name": "type", "symbols": [(lexer.has("lsqBracket") ? {type: "lsqBracket"} : lsqBracket), "_", "itParams", "_", (lexer.has("rsqBracket") ? {type: "rsqBracket"} : rsqBracket)], "postprocess": ([,,params,,]) => typeObjects.typeIterable(params)},
    {"name": "itParams", "symbols": ["p"], "postprocess": ([p]) => p},
    {"name": "p", "symbols": ["itType", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "p"], "postprocess": ([fst,,,,m]) => fst.concat(m)},
    {"name": "p", "symbols": ["itType"], "postprocess": ([fst]) => fst},
    {"name": "itType", "symbols": [(lexer.has("dotsInt") ? {type: "dotsInt"} : dotsInt), "_", (lexer.has("times") ? {type: "times"} : times), "_", "type"], "postprocess": ([n,,,,type]) => Array(+n.value.slice(3)).fill(typeObjects.typeSingleItElement(type))},
    {"name": "itType", "symbols": [(lexer.has("dots") ? {type: "dots"} : dots)], "postprocess": ([type]) => [typeObjects.typeDotsItElement(typeObjects.typeAny)]},
    {"name": "itType", "symbols": [(lexer.has("dots") ? {type: "dots"} : dots), "type"], "postprocess": ([,type]) => [typeObjects.typeDotsItElement(type)]},
    {"name": "itType", "symbols": ["type"], "postprocess": ([type]) => [typeObjects.typeSingleItElement(type)]},
    {"name": "type", "symbols": [(lexer.has("lcurlBracket") ? {type: "lcurlBracket"} : lcurlBracket), "_", "props", "_", (lexer.has("rcurlBracket") ? {type: "rcurlBracket"} : rcurlBracket)], "postprocess": ([,,props,,]) => typeObjects.typeObj(props)},
    {"name": "props", "symbols": ["pl"], "postprocess": ([p]) => p},
    {"name": "pl", "symbols": ["prop", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "pl"], "postprocess": ([fst,,,,m]) => fst.concat(m)},
    {"name": "pl", "symbols": ["prop"], "postprocess": ([fst]) => fst},
    {"name": "prop", "symbols": [(lexer.has("dotsInt") ? {type: "dotsInt"} : dotsInt), "_", (lexer.has("times") ? {type: "times"} : times), "_", "objProp"], "postprocess": ([n,,,,objProp]) => Array(+n.value.slice(3)).fill(typeObjects.typeSingleObjElement(objProp))},
    {"name": "prop", "symbols": [(lexer.has("dots") ? {type: "dots"} : dots)], "postprocess": ([objProp]) => []},
    {"name": "prop", "symbols": [(lexer.has("dots") ? {type: "dots"} : dots), "objProp"], "postprocess": ([,objProp]) => [typeObjects.typeDotsObjElement(objProp)]},
    {"name": "prop", "symbols": ["objProp"], "postprocess": ([objProp]) => [typeObjects.typeSingleObjElement(objProp)]},
    {"name": "objProp", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("colon") ? {type: "colon"} : colon), "_", "type"], "postprocess": ([key,,,,type]) => typeObjects.typeNameProp(key.value, type)},
    {"name": "objProp", "symbols": [(lexer.has("regex") ? {type: "regex"} : regex), "_", (lexer.has("colon") ? {type: "colon"} : colon), "_", "type"], "postprocess": ([key,,,,type]) => typeObjects.typeRegexProp(new RegExp(key), type)},
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
