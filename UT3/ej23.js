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

parser.feed(toEval);
console.log(JSON.stringify(parser.finish()[0]));
// interface.write(JSON.stringify(parser.finish()[0]));

process.exit();
