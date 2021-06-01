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
  equal: '=',
  differs: '!',
  lessThan: '<',
  greaterThan: '>',
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
});

const mathFunctions = new Map(
  Object.getOwnPropertyNames(Math)
    .filter((n) => typeof Math[n] === 'function')
    .map((n) => [n, Math[n]])
);

%}

@lexer lexer
@mathFunctions mathFunctions

line -> %whitespace:? conditional {% ([,conditional]) => conditional %}

conditional -> %cond %whitespace:? booleanOr %whitespace:? %then %whitespace:? booleanOr %whitespace:? %thenNot %whitespace:? booleanOr {% ([,,cond,,,,fst,,,,snd]) => cond ? fst : snd %}
conditional -> booleanOr {% ([booleanOr]) => booleanOr %}

booleanOr -> booleanAnd %whitespace:? %or %whitespace:? booleanAnd {% ([fst,,,,snd]) => fst || snd %}
booleanOr -> booleanAnd {% ([booleanAnd]) => booleanAnd %}

booleanAnd -> bool %whitespace:? %and %whitespace:? bool {% ([fst,,,,snd]) => fst && snd %}
booleanAnd -> comparator {% ([comparator]) => comparator %}
booleanAnd -> bool {% ([bool]) => bool %}

bool -> %lparen %whitespace:? conditional %whitespace:? %rparen {% ([,,conditional,,]) => conditional %}
bool -> %true {% ([]) => true %}
bool -> %false {% ([]) => false %}
bool -> %not bool {% ([,bool]) => !bool %}
bool -> fun {% ([fun]) => fun %}

comparator -> expression %whitespace:? %equal %equal %whitespace:? expression {% ([fst,,,,,snd]) => fst === snd %}
comparator -> expression %whitespace:? %differs %equal %whitespace:? expression {% ([fst,,,,,snd]) => fst !== snd %}
comparator -> expression %whitespace:? %lessThan %equal %whitespace:? expression {% ([fst,,,,,snd]) => fst <= snd %}
comparator -> expression %whitespace:? %greaterThan %equal %whitespace:? expression {% ([fst,,,,,snd]) => fst >= snd %}
comparator -> expression %whitespace:? %lessThan %whitespace:? expression {% ([fst,,,,snd]) => fst < snd %}
comparator -> expression %whitespace:? %greaterThan %whitespace:? expression {% ([fst,,,,snd]) => fst > snd %}

comparator -> expression {% ([expression]) => expression %}

expression -> expression %whitespace:? %plus %whitespace:? term {% ([fst,,,,snd]) => fst + snd %}
expression -> expression %whitespace:? %minus %whitespace:? term {% ([fst,,,,snd]) => fst - snd %}
expression -> term {% ([term]) => term %}

term -> term %whitespace:? %times %whitespace:? factor {% ([fst,,,,snd]) => fst * snd %}
term -> term %whitespace:? %over %over %whitespace:? factor {% ([fst,,,,,snd]) => Math.trunc(fst / snd) %}
term -> term %whitespace:? %over %whitespace:? factor {% ([fst,,,,snd]) => fst / snd %}
term -> %minus factor {% ([,fst]) => (-1) * fst %}
term -> factor {% ([factor]) => factor %}

factor -> %number {% ([number]) => +number %}
factor -> %lparen %whitespace:? conditional %whitespace:? %rparen {% ([,,conditional,,]) => conditional %}
factor -> fun {% ([fun]) => fun %}

fun -> %func %lparen %whitespace:? %rparen {% ([fun,,,]) => mathFunctions.get(fun.value).apply(null) %}
fun -> %func %lparen %whitespace:? params %whitespace:? %rparen {% ([fun,,,params,,]) => mathFunctions.get(fun.value).apply(null, params) %}

params -> m {% ([m]) => m %}
m -> conditional %whitespace:? %comma %whitespace:? m {% ([fst,,,,m]) => [fst].concat(m) %}
m -> conditional {% ([fst]) => [fst] %}