const fa = require('./fa.js');
// import * as fa from './fa.js';

let automaton = new fa.FiniteAutomaton({ start: 1, finals: [2], transitions: [ [1, 'a', 2], [2, 'b', 2], [2, 'b', 1] ] })
// for(const t of automaton.transitions) {
//     console.log(t)
// }
console.log(automaton.transitions)
console.log(automaton.isComplete())
console.log(automaton.isDeterministic());
/* 


newAutomaton = automaton.complete()
console.log(newAutomaton.transitions)
console.log(newAutomaton.isComplete())

console.log(newAutomaton.closure()) */

console.log(automaton.canGoTo(1, 'a'))

const l = [1, 2]
const set = new Set(l)
set.add(1)
console.log(set)

const f = new Set()
f.add(2)
f.add(3)

set.add([2, 3])
console.log(set)