const ASSOC = {
    left: 0,
    right: 1
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
            return a / b;
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
            return a - b;
        }
    }
}

function evaluate(postfixStack) {
    if(postfixStack.length < 1) {
        return null;
    }

    let tempStack = [];
    while(postfixStack.length > 0) {
        if(isOperator(postfixStack[postfixStack.length - 1])) {
            tempStack.push(OPERATORS[postfixStack.pop()].eval(parseFloat(tempStack.pop()), parseFloat(tempStack.pop())))
        } else {
            tempStack.push(postfixStack.pop())
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

function isOperator(string) {
    return string in OPERATORS;
}

function isNumber(string) {
    return string.match(/^[0-9]*$/)
}

function infixToPostfix(rawInfix) {
    infix = rawInfix.replace(/\s+/g, "");
    infix = infix.split(/([\+\-\*\/\^\(\)])/).filter((item) => {
        if(item !== '') {
            return item;
        }
    });

    let outputQueue = [];
    let operatorsStack = [];
    let token;
    for(let i = 0; i < infix.length; i++) {
        token = infix[i];

        if(isNumber(token)) {
            outputQueue.push(token);
        } else if(isOperator(token)) {
            let o1 = token;
            let o2 = operatorsStack[operatorsStack.length - 1];
            while(isOperator(o2) && ((OPERATORS[o1].associativity === ASSOC.Left && OPERATORS[o1].precedence <= OPERATORS[o2].precedence) || (OPERATORS[o1].associativity === ASSOC.Right && OPERATORS[o1].precedence < OPERATORS[o2].precedence))) {
                outputQueue.push(operatorsStack.pop());
                o2 = operatorsStack[operatorsStack.length - 1];
            }
            operatorsStack.push(o1);
        } else if(token === "(") {
            operatorsStack.push(token);
        } else if(token === ")") {
            while(operatorsStack[operatorsStack.length - 1] !== "(") {
                outputQueue.push(operatorsStack.pop());
            }
            operatorsStack.pop();
        }
    }

    while(operatorsStack.length > 0) {
        outputQueue.push(operatorsStack.pop());
    }

    return reverse(outputQueue);
}

console.log(evaluate(infixToPostfix(process.argv[2])));