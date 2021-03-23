function parse(expr) {
/*     if(!isBalanced(expr)) {
        return false
    } */

    
    
    const isList = /^\(.*\)$/.test(expr);
    if (!isList) {
        if (/[\(\)]/.test(expr)) {
            throw 'Invalid S-exp';
        } else {
            return expr
        }
    } else {
        const result = []
        const exp = expr.substring(1, expr.length - 1)
        const atoms = exp.split(' ')
        for (const atom of atoms) {
            result.push(parse(atom))
        }
        return result
    }
    
}

function isBalanced(str) {

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
}


// console.log(isBalanced('()())())'))
try {
    // console.log(parse("()())())"));
    // console.log(parse("(akjsckajsc)"));
    // console.log(parse("(lasncla lasnlas)"));
    console.log(parse("(kncas (aljcals qlnlasc (asncalscn)))"));
} catch (e) {
    console.error(e);
}



// t (a 1 b (* 2 3))
// /^\(.*\)$/

// var cadena = "(a b 5 ())";
// var result = /^\(.*\)$/.test(cadena);
// console.log(result);

