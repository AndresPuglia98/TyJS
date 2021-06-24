const Type = require('./type.js');

const tipo1 = Type('number & $0', [isPrime]);
console.log(tipo1.checks(3));
console.log(tipo1.checks(4));