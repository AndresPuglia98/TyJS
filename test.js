const fa = require('./fa.js');
// import * as fa from './fa.js';

let automaton = new fa.FiniteAutomaton({ start: 1, finals: [2], transitions: [ [1, 'a', 2], [2, 'b', 2], [2, 'b', 1] ] })
// for(const t of automaton.transitions) {
//     console.log(t)
// }
console.log(automaton)
console.log(automaton.isComplete())