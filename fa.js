/** Class for representing Finite Automata.
* 
*/
class FiniteAutomaton {
  /** Take a list of transitions like `[s0, sym, s1]` and crates a nested `Map`.
  */
  static makeTransitions(it) {
    return [...it].reduce((acc, [s0, sym, s1]) => {
      let s0Trans = acc.get(s0);
      if (!s0Trans) {
        s0Trans = new Map();
        acc.set(s0, s0Trans);
      }
      let s0SymStates = s0Trans.get(sym);
      if (!s0SymStates) {
        s0SymStates = new Set();
        s0Trans.set(sym, s0SymStates);
      }
      s0SymStates.add(s1);
      return acc;
    }, new Map());
  }

  /** Takes a `start` state, a list of `finals` and a list of `transitions`.
   * 
   * @param {int} [args.start=0]
   * @param {Array<int>} [args.finals=[]]
   * @param {Array<Array>} [args.transitions=[]]
  */
  constructor (args) {
    const {
      start = 0,
      finals = [],
      transitions = [],
    } = args || {};
    Object.defineProperties(this, {
      start: { value: start },
      finals: { value: new Set([...finals]) },
      transitions: { value: this.constructor.makeTransitions(transitions) },
    });
  }

  /** Determines if the given `state` is final.
   *
   * @param {int} [state]
   * @returns {boolean}
  */
  isFinal(state) {
    return this.finals.has(state);
  }

  /** An array with the states directly reachable from the given `state` with
   * the given `symbol`. Epsilon transitions use `''` as symbol.
   *
   * @param {int} [state]
   * @param {string} [symbol='']
   * @returns {Array<string>}
  */
  canGoTo(state, symbol = '') {
    const stateTrans = this.transitions.get(state);
    return [...stateTrans && stateTrans.get(symbol)];
  }

  goTo(states, symbol) {
    const output = new Set()
    for (const state of states) {
      const canGo = this.canGoTo(state, symbol)
      for (const goState of canGo) {
        output.add(goState)
      }
    }
    return this.closureSet(output)
  }
  
  /** A `Set` with all the states reachable from the given `from` state. If the
   * `withSymbols` set of symbols is given, only transitions with those symbols
   * will be considered.
   * 
   * @param {int} [from=this.start]
   * @param {Set<string>} [withSymbols=null]
   * @returns {Set<int>}
  */
  closure(from, withSymbols) {
    from = typeof from === 'undefined' ? this.start : from;
    withSymbols = withSymbols ? new Set([...withSymbols]) : null; 
    const pending = [from];
    const result = new Set();
    while (pending.length > 0) {
      const state = pending.pop();
      result.add(state);
      const stateTrans = this.transitions.get(state);
      if (stateTrans) {
        for (const [symbol, targets] of stateTrans.entries()) {
          for (const target of targets) {
            if (!result.has(target) && (!withSymbols || withSymbols.has(symbol))) {
              pending.push(target);
            }
          }
        }
      }
    }
    return result;
  }

  closureSet(from) {
    const finalSet = new Set()
    for (const state of from) {
      const clo = this.closure(state, '')
      clo.forEach(finalSet.add, finalSet)
    }
    return finalSet
  }

  /** The `Set` of all states in this automaton, reachable from the start state.
   * 
   * @returns {Set<int>}
  */
  states() {
    return this.closure(this.start);
  }

  /** A `Set` with all the symbols used by this automaton `start` state by
   * default.
   * 
   * @returns {Set<int>}
  */
  alphabet() {
    const result = new Set();
    for (const trans of this.transitions.values()) {
      for (const symbol of trans.keys()) {
        result.add(symbol);
      }
    }
    return result;
  }

  /** Enumerates all possible paths for the given `input` in this automaton,
   * from the given `from` state (or `start` by default).
   * 
   * @param {string} input 
   * @param {int} [from=this.start]
   * @yields {Array<>}
   */
  * paths(input, from) {
    from = typeof from === 'undefined' ? this.start : from;
    function* pathRecursive(inputIndex, currentPath) {
      if (inputIndex < input.length) {
        const symbol = input[inputIndex];
        const currentState = currentPath[currentPath.length - 1];
        for (const target of this.canGoTo(currentState, symbol)) {
          yield* pathRecursive(inputIndex + 1, currentPath.concat([target]));
        }
      } else {
        yield currentPath;
      }
    }
    yield* pathRecursive(0, [from]);
  }

  /** Decides if the given `input` is accepted by this automaton.
   * 
   * @param {string} input 
   * @param {int} [from=this.start]
   * @returns {boolean}
  */
  parse(input, from) {
    for (const path of this.paths(input, from)) {
      const lastState = path[path.length-1]; 
      if (this.isFinal(lastState)) {
        return true;
      }
    }
    return false;
  }

  /** Decides whether this automaton is complete or not. 
   * 
   * @returns {boolean}
  */
   isComplete() {
    const alphabet = this.alphabet();
    for (const trans of this.transitions.values()) {
      for (const symbol of alphabet) {
        if (!trans.has(symbol)) {
          return false;
        }
      }
    }
    return true;
  }

  /** Makes a new `FiniteAutomaton`, equivalent to this one, but complete. 
   * 
   * @returns {FiniteAutomaton}
  */
  complete() {
    if (this.isComplete()) {
        return this;
    } else {
        const start = this.start;
        const finals = [...this.finals];
        const transitions = [];
        const alphabet = this.alphabet();
        for (const [state, trans] of this.transitions.entries()) {
            for (const symbol of alphabet) {
                if (!trans.has(symbol)) {
                    transitions.push([state, symbol, -1]);
                }
            }
            for (const [symbol, s1s] of trans.entries()) {
                for (const s1 of s1s) {
                    transitions.push([state, symbol, s1]);
                }
            }
        }
        for (const symbol of alphabet) {
            transitions.push([-1, symbol, -1]);
        }
        return new this.constructor({ start, finals, transitions });
    }
  }

  clone() {
    const start = this.start;
    const finals = [...this.finals];
    const transitions = [];
    for (const [s0, symbols] of this.transitions.entries()) {
      for (const [symbol, s1s] of symbols.entries()) {
        for (const s1 of s1s) {
          transitions.push([s0, symbol, s1]);
        }
      }
    }
    return new this.constructor({ start, finals, transitions });
  }

  /** Decides whether this automaton has epsilon transitions or not.
   * 
   * @returns {boolean}
  */
  hasEpsilonTransitions() {
    for (const trans of this.transitions.values()) {
      if (trans.has('')) {
        return true;
      }
    }
    return false;
  }

  /** Decides whether this automaton is deterministic or not, i.e. if there is
   * at most one transition from every state with every symbol.
   * 
   * @returns {boolean}
  */
  isDeterministic() {
    for (const trans of this.transitions.values()) {
      for (const target of trans.values()) {
        if (target.size > 1) {
          return false;
        }
      }
    }
    return true;
  }

  /** Makes a new `FiniteAutomaton`, equivalent to this one, but deterministic. 
   * 
   * @returns {FiniteAutomaton}
  */
  dfa() {
    if (this.isDeterministic()) {
      return this;
    } else {
      const newStates = new Map();
      const newFinals = [];
      const newTransitions = [];

      const alphabet = this.alphabet();
      const stateSet = this.closureSet(this.start);
      newStates.set(stateSet, 0);
      const finalNumber = 1;

      const pending = [stateSet];

      while (pending.length > 0) {
        const currentStateSet = pending.pop();
        for (const symbol of alphabet) {
          const goToSet = goTo(currentStateSet, symbol);
          if (goToSet.size() > 0) {
            if (!newStates.has(goToSet)) {
              newStates.set(goToSet, finalNumber);
              newTransitions.push([newStates.get(currentStateSet), symbol, finalNumber]);
              finalNumber++;
              pending.push(goToSet);
            } else {
              newTransitions.push([newStates.get(currentStateSet), symbol, newStates.get(stateSet)]);
            }
          }
        }
      }
    }
  }
} // class FiniteAutomaton

module.exports = { FiniteAutomaton };
