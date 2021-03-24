function parse(expr) {
    const isList = /^\(.*\)$/.test(expr)
    if (!isList) {
        if (/[\(\)]/.test(expr)) {
            throw 'Invalid S-exp'
        } else {
            return expr
        }
    } else {
        const result = []
        const exp = expr.substring(1, expr.length - 1)
        const atoms = customSplit(exp)
        for (const atom of atoms) {
            result.push(parse(atom))
        }
        return result
    }
    
}

function customSplit(str) {
    const result = []
    let atom = ''
    let canStartList = true
    let i = 0
    while (i < str.length) {
        const char = str.charAt(i)
        if (char === ' ') {
            result.push(atom)
            atom = ''
            canStartList = true
        } else if (char === '(') {
            if (canStartList) {
                let parCount = 1
                for (let j = i+1; j<str.length; j++) {
                    const auxChar = str.charAt(j)
                    if (auxChar === '(') {
                        parCount++
                    } else if (auxChar === ')') {
                        parCount--
                    }
                    if (parCount === 0) {
                        atom = str.substring(i, j+1)
                        i = j
                        canStartList = false
                        break
                    }
                }
                if (parCount > 0) {
                    throw 'Invalid S-exp'
                }
            } else {
                throw 'Invalid S-exp'
            }
        } else {
            atom += char
            canStartList = false
        }
        i++
    }
    result.push(atom)
    return result
}

/* function isBalanced(str) {

    const stack = []
    const paren_obj = { ')' : '(' }

    for (const char of str) {
        if (char in paren_obj) {
            
            const top = stack.pop() || '#'

            if (top != paren_obj[char]) {
                return false
            }

        } else if(Object.values(paren_obj).includes(char)) {
            stack.push(char)
        }
    }
    return !!stack
} */


// console.log(isBalanced('()())())'))


try {
    //console.log(parse("()())())"));
    console.log(parse("(akjsckajsc)"));
    console.log(parse("(lasncla lasnlas)"));
    console.log(parse("(kncas (aljcals qlnlasc (asncalscn)))"));
    //console.log(parse("(kncas(aljcals qlnlasc (asncalscn)))"));
    console.log(parse("(kncas (aljcals qlnlasc (asncalscn))))"));
} catch (e) {
    console.error(e);
}

// t (a 1 b (* 2 3))
// /^\(.*\)$/

// var cadena = "(a b 5 ())";
// var result = /^\(.*\)$/.test(cadena);
// console.log(result);

