const nearley = require('nearley');
const grammar = require('./grammar.js');
const readline = require('readline');

const args = process.argv.slice(2);

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const toEval = args[0];
// console.log(toEval);
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));


if(args.includes('-t')) {
  parser.lexer.reset(toEval);
  let token = parser.lexer.next();
  while(token) {
    console.log(token);
    token = parser.lexer.next();
  }
}

parser.lexer.reset()
parser.feed(toEval);

console.log(JSON.stringify(parser.finish()[0]));
// interface.write(JSON.stringify(parser.finish()[0]));

process.exit();
