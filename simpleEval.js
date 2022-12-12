const ASSOC = {
    Left: 0,
    Right: 1
}

const OPERATORS = {
    "^": {
        precedence: 4,
        associativity: ASSOC.Right,
        eval: (a, b) => {
            return Math.pow(a, b);
        }
    },
    "/": {
        precedence: 3,
        associativity: ASSOC.Left,
        eval: (a, b) => {
            return b / a;
        }
    },
    "*": {
        precedence: 3,
        associativity: ASSOC.Left,
        eval: (a, b) => {
            return a * b;
        }
    },
    "+": {
        precedence: 2,
        associativity: ASSOC.Left,
        eval: (a, b) => {
            return a + b;
        }
    },
    "-": {
        precedence: 2,
        associativity: ASSOC.Left,
        eval: (a, b) => {
            return b - a;
        }
    }
}

const FUNCTIONS = {
    "sin": {
        precedence: 10,
        associativity: ASSOC.Right,
        num_operands: 1,
        eval: (args) => {
            return Math.sin(parseFloat(args[0]));
        }
    }
}

function evaluate(postfixStack) {
    if(postfixStack.length < 1) {
        return null;
    }

    let tempStack = [];
    while(postfixStack.length > 0) {
        let token = postfixStack.pop();

        if(isOperator(token)) {
            tempStack.push(OPERATORS[token].eval(parseFloat(tempStack.pop()), parseFloat(tempStack.pop())))
        } else if(isFunction(token)) {
            let args = [];
            for(let i = 0; i < FUNCTIONS[token].num_operands; i++) {
                args[i] = tempStack.pop();
            }
            tempStack.push(FUNCTIONS[token].eval(args));
        } else {
            tempStack.push(token)
        }
    }

    return tempStack.pop();
}

function reverse(array) {
    let result = [];
    while(array.length > 0) {
        result.push(array.pop());
    }

    return result;
}

function isFunction(string) {
    return string in FUNCTIONS;
}

function isOperator(string) {
    return string in OPERATORS;
}

function isNumber(string) {
    return string.match(/^[0-9]+|\.?[0-9]+$/)
}

function getAssociativity(token) {
    if(token in OPERATORS) {
        return OPERATORS[token].associativity;
    } else if (token in FUNCTIONS) {
        return FUNCTIONS[token].associativity
    } else {
        throw `token ${token} undefined`
    }
}

function getPrecedence(token) {
    if(token in OPERATORS) {
        return OPERATORS[token].precedence;
    } else if (token in FUNCTIONS) {
        return FUNCTIONS[token].precedence;
    } else {
        throw `token ${token} undefined`
    }
}

function print(str) {
    console.log(str);
}

function infixToPostfix(rawInfix) {
    infix = rawInfix.replace(/\s+/g, "");
    infix = infix.split(/([\+\-\*\/\^\(\)])/).filter((item) => {
        if(item !== '') {
            return item;
        }
    });

    // print(infix);

    let outputQueue = [];
    let operatorsStack = [];
    let token;
    for(let i = 0; i < infix.length; i++) {
        // print(outputQueue);
        token = infix[i];

        if(isNumber(token)) {
            outputQueue.push(parseFloat(token));
        } else if(isOperator(token)) {
            let o1 = token;
            let o2 = operatorsStack[operatorsStack.length - 1];
            while((isOperator(o2) || isFunction(o2)) && ((getAssociativity(o1) === ASSOC.Left && getPrecedence(o1) <= getPrecedence(o2)) 
                || (getAssociativity(o1) === ASSOC.Right && getPrecedence(o1) < getPrecedence(o2)))) {
                outputQueue.push(operatorsStack.pop());
                o2 = operatorsStack[operatorsStack.length - 1];
            }
            operatorsStack.push(o1);
        } else if(isFunction(token)) {
            operatorsStack.push(token);
        } else if(token === "(") {
            operatorsStack.push(token);
        } else if(token === ")") {
            while(operatorsStack[operatorsStack.length - 1] !== "(") {
                outputQueue.push(operatorsStack.pop());
            }
            operatorsStack.pop();
        } else {
            console.log(`Unknown token: ${token}`)
            exit();
        }
    }

    while(operatorsStack.length > 0) {
        outputQueue.push(operatorsStack.pop());
    }

    return reverse(outputQueue);
}

postfix = infixToPostfix(process.argv[2])
console.log(evaluate(postfix));