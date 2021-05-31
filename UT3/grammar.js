// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');

const lexer = moo.compile({
  lparen: '(',
  rparen: ')',
  whitespace: { match: /(?: |(?:\n)|(?:\r)|(?:\t))+/, lineBreaks: true },
  number: /(?:\d+)(?:(?:\.\d+))?(?:[Ee](?:[\+\-])?(?:\d+))?/,
  comma: ',',
  times: '*',
  over: '/',
  plus: '+',
  minus: '-',
  equalTo: '==',
  differs: '!=',
  lessThan: '<',
  greaterThan: '>',
  lessOrEqualTo: '<=',
  greaterOrEqualTo: '>=',
  remainder: '%',
  true: 'true',
  false: 'false',
  not: '!',
  and: '&&',
  or: '||',
  cond: 'if',
  then: 'then',
  thenNot: 'else',
  func: ['abs', 'min', 'max', 'floor', 'sin', 'cos', 'log'],
  lsqbracket: '[',
  rsqbracket: ']',
});

const mathFunctions = new Map(
  Object.getOwnPropertyNames(Math)
    .filter((n) => typeof Math[n] === 'function')
    .map((n) => [n, Math[n]])
);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "conditional", "symbols": [(lexer.has("cond") ? {type: "cond"} : cond), "booleanOr", (lexer.has("then") ? {type: "then"} : then), "booleanOr", (lexer.has("thenNot") ? {type: "thenNot"} : thenNot), "booleanOr"], "postprocess": ([, cond, , fst, , snd]) => cond ? fst : snd},
    {"name": "conditional", "symbols": ["booleanOr"], "postprocess": ([booleanOr]) => booleanOr},
    {"name": "booleanOr", "symbols": ["booleanAnd", (lexer.has("or") ? {type: "or"} : or), "booleanAnd"], "postprocess": ([fst, , snd]) => fst || snd},
    {"name": "booleanOr", "symbols": ["booleanAnd"], "postprocess": ([booleanAnd]) => booleanAnd},
    {"name": "booleanAnd", "symbols": ["bool", (lexer.has("and") ? {type: "and"} : and), "bool"], "postprocess": ([fst, , snd]) => fst && snd},
    {"name": "booleanAnd", "symbols": ["comparator"], "postprocess": ([comparator]) => comparator},
    {"name": "booleanAnd", "symbols": ["bool"], "postprocess": ([bool]) => bool},
    {"name": "bool$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "bool$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bool$ebnf$2", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "bool$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bool", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "bool$ebnf$1", "conditional", "bool$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([,, conditional,,]) => conditional},
    {"name": "bool", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": ([]) => true},
    {"name": "bool", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": ([]) => false},
    {"name": "bool", "symbols": [(lexer.has("not") ? {type: "not"} : not), "bool"], "postprocess": ([, bool]) => !bool},
    {"name": "bool", "symbols": ["fun"], "postprocess": ([fun]) => fun},
    {"name": "comparator", "symbols": ["expression", (lexer.has("equalTo") ? {type: "equalTo"} : equalTo), "expression"], "postprocess": ([fst, , snd]) => fst === snd},
    {"name": "comparator", "symbols": ["expression", (lexer.has("differs") ? {type: "differs"} : differs), "expression"], "postprocess": ([fst, , snd]) => fst !== snd},
    {"name": "comparator", "symbols": ["expression", (lexer.has("lessThan") ? {type: "lessThan"} : lessThan), "expression"], "postprocess": ([fst, , snd]) => fst < snd},
    {"name": "comparator", "symbols": ["expression", (lexer.has("greaterThan") ? {type: "greaterThan"} : greaterThan), "expression"], "postprocess": ([fst, , snd]) => fst > snd},
    {"name": "comparator", "symbols": ["expression", (lexer.has("lessOrEqualTo") ? {type: "lessOrEqualTo"} : lessOrEqualTo), "expression"], "postprocess": ([fst, , snd]) => fst <= snd},
    {"name": "comparator", "symbols": ["expression", (lexer.has("greaterOrEqualTo") ? {type: "greaterOrEqualTo"} : greaterOrEqualTo), "expression"], "postprocess": ([fst, , snd]) => fst >= snd},
    {"name": "comparator", "symbols": ["expression"], "postprocess": ([expression]) => expression},
    {"name": "expression", "symbols": ["expression", (lexer.has("plus") ? {type: "plus"} : plus), "term"], "postprocess": ([fst, , snd]) => fst + snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("minus") ? {type: "minus"} : minus), "term"], "postprocess": ([fst, , snd]) => fst - snd},
    {"name": "expression", "symbols": ["term"], "postprocess": ([term]) => term},
    {"name": "term", "symbols": ["term", (lexer.has("times") ? {type: "times"} : times), "factor"], "postprocess": ([fst, , snd]) => fst * snd},
    {"name": "term", "symbols": ["term", (lexer.has("over") ? {type: "over"} : over), "factor"], "postprocess": ([fst, , snd]) => fst / snd},
    {"name": "term", "symbols": ["term", (lexer.has("over") ? {type: "over"} : over), (lexer.has("over") ? {type: "over"} : over), "factor"], "postprocess": ([fst, , , snd]) => Math.trunc(fst / snd)},
    {"name": "term", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus), "factor"], "postprocess": ([ , fst]) => (-1) * fst},
    {"name": "term", "symbols": ["factor"], "postprocess": ([factor]) => factor},
    {"name": "factor", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([number]) => +number},
    {"name": "factor$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "factor$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "factor$ebnf$2", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "factor$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "factor", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "factor$ebnf$1", "conditional", "factor$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([,, conditional,,]) => conditional},
    {"name": "factor", "symbols": ["fun"], "postprocess": ([fun]) => fun},
    {"name": "fun", "symbols": [(lexer.has("func") ? {type: "func"} : func), (lexer.has("lparen") ? {type: "lparen"} : lparen), (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([fun, , ]) => mathFunctions.get(fun.value).apply(null)},
    {"name": "fun", "symbols": [(lexer.has("func") ? {type: "func"} : func), (lexer.has("lparen") ? {type: "lparen"} : lparen), "params", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([fun, , params, ]) => mathFunctions.get(fun.value).apply(null, params)},
    {"name": "params", "symbols": ["m"], "postprocess": ([m]) => m},
    {"name": "m", "symbols": ["conditional", (lexer.has("comma") ? {type: "comma"} : comma), "m"], "postprocess": ([fst, , m]) => [fst].concat(m)},
    {"name": "m", "symbols": ["conditional"], "postprocess": ([fst]) => [fst]}
]
  , ParserStart: "conditional"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
