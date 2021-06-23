/** Example of a lexer for the CSV format using `moo.js`.
 */ 
const moo = require('moo'); // `npm i moo` to install.
const fs = require('fs'); // native NodeJS module.

/** Run executing `node lex-csv.js < file.csv > tokens.txt`. */
(function main() {
  const lexer = moo.compile({
    value: /[^,"\n\r\u2028\u2029]+/,
    quoted: /(?:"[^"\n\r\u2028\u2029]*")+/,
    fieldSep: /,/,
    recordSep: { match: /\r?\n|[\u2028\u2029]/, lineBreaks: true },
  });

  const input = fs.readFileSync(process.stdin.fd, 'utf-8');

  lexer.reset(input)
  for (const token of lexer) {
    console.log(token);
  }
})();

/* Possible tests. 
________________________________________________________________________________
Header 1,Header 2,Header 3
123,"A B","""Padding"""
1|2,C+D,"','"
________________________________________________________________________________
Broken,format,"wrong quotes
________________________________________________________________________________
*/