const nearley = require('nearley');
const grammar = require('./grammar.js');
const readline = require('readline');

const argv = require('minimist')(process.argv.slice(2));

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tokens = argv.t;
const cli = argv.e;

let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

if (cli) {
  if (tokens){
    parser.lexer.reset(cli);
    let token = parser.lexer.next();
    while(token) {
      console.log(token);
      token = parser.lexer.next();
    }
  } else {
    parser.feed(cli);
    console.log(JSON.stringify(parser.finish()[0]));
  }
  process.exit();
}

let tokenLine = false;

const waitForUserInput = () => {
  interface.question('', function(answer) {
    if (answer.startsWith(':t')) {
      answer = answer.slice(2);
      tokenLine = true;
    }
    if (tokens || tokenLine){
      parser.lexer.reset(answer);
      let token = parser.lexer.next();
      while(token) {
        console.log(token);
        token = parser.lexer.next();
      }
    } else {
      parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(answer);
      console.log(JSON.stringify(parser.finish()[0]));
    }
    tokenLine = false;
    waitForUserInput();
  });
}

waitForUserInput();


type -> %lsqBracket itParams %rsqBracket {% ([,params,]) => typeObjects.typeIterable(params) %}
itParams -> p {% ([p]) => p %}
p -> itType _ %comma _ p {% ([fst,,,,m]) => fst.concat(m) %}
p -> itType {% ([fst]) => fst %}

itType -> type {% ([type]) => [type] %}
itType -> %dots {% ([type]) => [typeObjects.typeAny] %}
itType -> %dots type {%  %}
itType -> %dots /^\d+$/ _ %times _ type {%  %}