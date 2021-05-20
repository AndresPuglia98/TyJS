@{%
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
%}

@lexer lexer

expression -> expression %plus term {% ([fst, , snd]) => fst + snd %}
expression -> expression %minus term {% ([fst, , snd]) => fst - snd %}
expression -> term {% ([term]) => term %}

term -> term %times %number {% ([fst, , snd]) => fst * snd %}
term -> term %over %number {% ([fst, , snd]) => fst / snd %}
term -> factor {% ([factor]) => factor %}

factor -> %number {% ([number]) => +number %}
factor -> %lparen %whitespace:? expression %whitespace:? %rparen {% ([,, expression,,]) => expression %}


