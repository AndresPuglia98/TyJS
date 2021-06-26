const Type = require('./type.js');

function isPrime(num) {
    for(var i = 2; i < num; i++)
        if(num % i === 0) return false;
    return num > 1;
}

const tipo1 = new Type('number & $0', [isPrime]);
console.log(tipo1);
console.log(tipo1.checks(3));
console.log(tipo1.checks(4));
console.log(tipo1.checks('3'));

const tipo2 = new Type('in [23, "abc", true]', [isPrime]);
console.log(tipo2);
console.log(tipo2.checks(23));
console.log(tipo2.checks('abc'));
console.log(tipo2.checks(true));
console.log(tipo2.checks(45));

const tipo3 = new Type('char | byte');
console.log(tipo3);
console.log(tipo3.checks('a'));
console.log(tipo3.checks('abc'));
console.log(tipo3.checks(3456));
console.log(tipo3.checks(45));