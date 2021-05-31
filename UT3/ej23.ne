@{%
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

%}

@lexer lexer
@mathFunctions mathFunctions

conditional -> %cond booleanOr %then booleanOr %thenNot booleanOr {% ([, cond, , fst, , snd]) => cond ? fst : snd %}
conditional -> booleanOr {% ([booleanOr]) => booleanOr %}

booleanOr -> booleanAnd %or booleanAnd {% ([fst, , snd]) => fst || snd %}
booleanOr -> booleanAnd {% ([booleanAnd]) => booleanAnd %}

booleanAnd -> bool %and bool {% ([fst, , snd]) => fst && snd %}
booleanAnd -> comparator {% ([comparator]) => comparator %}
booleanAnd -> bool {% ([bool]) => bool %}

bool -> %lparen %whitespace:? conditional %whitespace:? %rparen {% ([,, conditional,,]) => conditional %}
bool -> %true {% ([]) => true %}
bool -> %false {% ([]) => false %}
bool -> %not bool {% ([, bool]) => !bool %}
bool -> fun {% ([fun]) => fun %}

comparator -> expression %equalTo expression {% ([fst, , snd]) => fst === snd %}
comparator -> expression %differs expression {% ([fst, , snd]) => fst !== snd %}
comparator -> expression %lessThan expression {% ([fst, , snd]) => fst < snd %}
comparator -> expression %greaterThan expression {% ([fst, , snd]) => fst > snd %}
comparator -> expression %lessOrEqualTo expression {% ([fst, , snd]) => fst <= snd %}
comparator -> expression %greaterOrEqualTo expression {% ([fst, , snd]) => fst >= snd %}
comparator -> expression {% ([expression]) => expression %}

expression -> expression %plus term {% ([fst, , snd]) => fst + snd %}
expression -> expression %minus term {% ([fst, , snd]) => fst - snd %}
expression -> term {% ([term]) => term %}

term -> term %times factor {% ([fst, , snd]) => fst * snd %}
term -> term %over factor {% ([fst, , snd]) => fst / snd %}
term -> term %over %over factor {% ([fst, , , snd]) => Math.trunc(fst / snd) %}
term -> %minus factor {% ([ , fst]) => (-1) * fst %}
term -> factor {% ([factor]) => factor %}

factor -> %number {% ([number]) => +number %}
factor -> %lparen %whitespace:? conditional %whitespace:? %rparen {% ([,, conditional,,]) => conditional %}
factor -> fun {% ([fun]) => fun %}

fun -> %func %lparen %rparen {% ([fun, , ]) => mathFunctions.get(fun.value).apply(null) %}
fun -> %func %lparen params %rparen {% ([fun, , params, ]) => mathFunctions.get(fun.value).apply(null, params) %}

params -> m {% ([m]) => m %}
m -> conditional %comma m {% ([fst, , m]) => [fst].concat(m) %}
m -> conditional {% ([fst]) => [fst] %}