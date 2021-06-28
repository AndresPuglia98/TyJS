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

const tipo4 = new Type('number & /^\\d{3}$/'); // preguntar esto
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

const tipo7 = new Type('[double, string, ...int]');
console.log(tipo7);
console.log(tipo7.checks('34.5') === false);
console.log(tipo7.checks(34.5) === false);
console.log(tipo7.checks([3.14, "abc"]) === true);
console.log(tipo7.checks([3.14, "abc", 2, 3]) === true);
console.log(tipo7.checks([3.14, "abc", 3.14]) === false);
console.log(tipo7.checks(new Set([3.14, "abc", 2, 3])) === true);
console.log(tipo7.checks(new Set([3.14, "abc", "sdsf"])) === false);

const tipo8 = new Type('[...number]');
console.log(tipo8);
console.log(tipo8.checks('34.5') === false);
console.log(tipo8.checks(34.5) === false);
console.log(tipo8.checks([3.14, "abc"]) === false);
console.log(tipo8.checks([3.14, 2, 3]) === true);
console.log(tipo8.checks(["abc"]) === false);
console.log(tipo8.checks([]) === true);

const tipo9 = new Type('[...]');
console.log(tipo9);
console.log(tipo9.checks('34.5') === true); // esta bien esto?
console.log(tipo9.checks(34.5) === false);
console.log(tipo9.checks([3.14, "abc"]) === true);
console.log(tipo9.checks([3.14, 2, 3]) === true);
console.log(tipo9.checks(["abc"]) === true);
console.log(tipo9.checks([]) === true);

const tipo10 = new Type('[boolean, ...number]');
console.log(tipo10);
console.log(tipo10.checks(34.5) === false);
console.log(tipo10.checks([3.14]) === false);
console.log(tipo10.checks([true]) === true);
console.log(tipo10.checks(['true']) === false);
console.log(tipo10.checks([]) === false);

/* const tipo11 = new Type('[...boolean, boolean]');
console.log(tipo11);
console.log(tipo11.checks([true]) === true);
console.log(tipo11.checks([]) === false); */

const tipo12 = new Type('[...[number, string]]');
console.log(tipo12);
console.log(tipo12.checks([[1, 'a']]) === true);
const m1 = new Map();
m1.set(1, 'b');
m1.set(2, 'c');
console.log(tipo12.checks(m1) === true);
