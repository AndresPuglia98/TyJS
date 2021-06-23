const moo = require("moo");

let myJSON =
  '{"widget": {\n  "debug": "on",\n  "window": {\n      "title": "Sample Konfabulator Widget",\n      "name": "main_window",\n      "width": 500,\n      "height": 500\n  },\n  "image": { \n      "src": "Images/Sun.png",\n      "name": "sun1",\n      "hOffset": 250,\n      "vOffset": 250,\n      "alignment": "center"\n  },\n  "text": {\n      "data": "Click Here",\n      "size": 36,\n      "style": "bold",\n      "name": "text1",\n      "hOffset": 250,\n      "vOffset": 100,\n      "alignment": "center",\n      "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"\n  }\n}}';

parseJSON = (jsonFile) => {
  let lexer = moo.compile({
    lparen: "(",
    rparen: ")",
    lcurly: "{",
    rcurly: "}",
    points: ":",
    colon: ",",
    rrectparen: "[",
    lrectparen: "]",
    keyword: ["null", "true", "false"],
    WS: { match: /(?: |(?:\n)|(?:\r)|(?:\t))+/, lineBreaks: true },
    number: /\-?(?:[0-9]+)(?:(?:\.[0-9]+))?(?:[Ee](?:[\+\-])?(?:[0-9]+))?/,
    string: /"(?:(?:[^"\n\r\\]|\\(?:["trbnf\\/]|\\u[a-fA-F0-9]{4})))*"/,
  });
  lexer.reset(jsonFile);
  let tokens = Array.from(lexer);
  for (let token of tokens) {
    console.log(
      "type: " + token.type + " text: " + JSON.stringify(token.value)
    );
  }
};

parseJSON(myJSON);