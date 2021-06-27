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

const tipo2 = new Type('in [23, "abc", false]', [isPrime]);
console.log(tipo2);
console.log(tipo2.checks(23));
console.log(tipo2.checks('abc'));
console.log(tipo2.checks(true));
console.log(tipo2.checks(45));
console.log(tipo2.checks(false));

const tipo3 = new Type('char | byte');
console.log(tipo3);
console.log(tipo3.checks('a'));
console.log(tipo3.checks('abc'));
console.log(tipo3.checks(3456));
console.log(tipo3.checks(45));

const tipo4 = new Type('number & /^\d{3}/');
console.log(tipo4);
console.log(tipo4.checks('345'));
console.log(tipo4.checks(345));
console.log(tipo4.checks(3456));

const tipo5 = new Type('int');
console.log(tipo5);
console.log(tipo5.checks('345'));
console.log(tipo5.checks(345));
console.log(tipo5.checks(3.14));

const tipo6 = new Type('double');
console.log(tipo6);
console.log(tipo6.checks('345'));
console.log(tipo6.checks(345));
console.log(tipo6.checks(3.14));
console.log(tipo6.checks(NaN));
console.log(tipo6.checks(Infinity));
console.log(tipo6.checks(3e-6));

