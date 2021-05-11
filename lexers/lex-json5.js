const moo = require('moo'); // `npm i moo` to install.
const fs = require('fs'); // native NodeJS module.

(function main() {
  const lexer = moo.compile({
    blockComment: { match: /\/\*(?:.|\n)*?\*\//u, lineBreaks: true },
    lineComment: { match: /\/\/.*?(?:\r?\n|$)/u, lineBreaks: true },
    json5string: {
      match: /(?:"(?:.|\\\n)*?")|(?:'(?:.|\\\n)*?')/u,
      lineBreaks: true,
    },
    json5binary: /(?:0b(?:0|1)(?:_?(?:0|1))*)/u,
    json5hexa: /(?:0x[0-9a-fA-F](?:_?[0-9a-fA-F])*)/u,
    json5octal: /(?:0o[0-7](?:_?[0-7])*)/u,
    // leadingDecimalPoint: /(?:(?:\.\d(?:_?\d)*)?(?:[eE][-+]?\d(?:_?\d)*))?)/u,
    json5decimal: /(?:\d(?:_?\d)*(?:(?:\.\d(?:_?\d)*)?(?:[eE][-+]?\d(?:_?\d)*))?)/u,
    json5infinity: /Infinity/u,
    json5nan: /NaN/u,
    json5boolean: /true|false/u,
    json5null: /null/u,
    json5identifier: /[\p{L}_$][\p{L}0-9_$]*/u,
    curlyOpenBracket: /\{/u,
    curlyCloseBracket: /\}/u,
    openBracket: /\[/u,
    closeBracket: /\]/u,
    colon: /:/u,
    comma: /,/u,
    whitespace: { match: /\s+/u, lineBreaks: true },

    // value: /[^,"\n\r\u2028\u2029(?:?:)]+/,
    // quoted: /(?:"[^"\n\r\u2028\u2029]*")+/,
    // fieldSep: /,/,
  });

  const input = fs.readFileSync(process.stdin.fd, 'utf-8');

  lexer.reset(input);
  for (const token of lexer) {
    console.log(token);
  }
})();

//  {
//    // comments
//    unquoted: 'and you can quote me on that',
//    singleQuotes: 'I can use "double quotes" here',
//    lineBreaks: "Look, Mom! \
//  No \\n's!",
//    hexadecimal: 0xdecaf,
//    leadingDecimalPoint: .8675309, andTrailing: 8675309.,
//    positiveSign: +1,
//    trailingComma: 'in objects', andIn: ['arrays',],
//    "backwardsCompatible": "with JSON",
//  }
