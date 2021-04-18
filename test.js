const fa = require('./fa.js');

let automaton = new fa.FiniteAutomaton({ start: 1, finals: [2], transitions: [ [1, 'a', 2], [2, 'b', 2], [2, 'b', 1] ] })
// for(const t of automaton.transitions) {
//     console.log(t)
// }
console.log(automaton.transitions)
console.log(automaton.isComplete())

newAutomaton = automaton.complete()
console.log(newAutomaton.transitions)
console.log(newAutomaton.isComplete())