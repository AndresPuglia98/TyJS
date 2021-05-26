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

expression -> expression %equalTo expression {% ([fst, , snd]) => fst === snd %}
expression -> expression %differs expression {% ([fst, , snd]) => fst !== snd %}
expression -> expression %lessThan expression {% ([fst, , snd]) => fst < snd %}
expression -> expression %greaterThan expression {% ([fst, , snd]) => fst > snd %}
expression -> expression %lessOrEqualTo expression {% ([fst, , snd]) => fst <= snd %}
expression -> expression %greaterOrEqualTo expression {% ([fst, , snd]) => fst >= snd %}

expression -> expression %plus term {% ([fst, , snd]) => fst + snd %}
expression -> expression %minus term {% ([fst, , snd]) => fst - snd %}
expression -> term {% ([term]) => term %}

term -> term %times factor {% ([fst, , snd]) => fst * snd %}
term -> term %over factor {% ([fst, , snd]) => fst / snd %}
term -> term %over %over factor {% ([fst, , , snd]) => Math.trunc(fst / snd) %}
term -> %minus factor {% ([ , fst]) => (-1) * fst %}
term -> factor {% ([factor]) => factor %}

factor -> %number {% ([number]) => +number %}
factor -> %lparen %whitespace:? expression %whitespace:? %rparen {% ([,, expression,,]) => expression %}


