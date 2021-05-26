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
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "expression", "symbols": ["expression", (lexer.has("equalTo") ? {type: "equalTo"} : equalTo), "expression"], "postprocess": ([fst, , snd]) => fst === snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("differs") ? {type: "differs"} : differs), "expression"], "postprocess": ([fst, , snd]) => fst !== snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("lessThan") ? {type: "lessThan"} : lessThan), "expression"], "postprocess": ([fst, , snd]) => fst < snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("greaterThan") ? {type: "greaterThan"} : greaterThan), "expression"], "postprocess": ([fst, , snd]) => fst > snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("lessOrEqualTo") ? {type: "lessOrEqualTo"} : lessOrEqualTo), "expression"], "postprocess": ([fst, , snd]) => fst <= snd},
    {"name": "expression", "symbols": ["expression", (lexer.has("greaterOrEqualTo") ? {type: "greaterOrEqualTo"} : greaterOrEqualTo), "expression"], "postprocess": ([fst, , snd]) => fst >= snd},
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
    {"name": "factor", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "factor$ebnf$1", "expression", "factor$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([,, expression,,]) => expression}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
