import { Token } from "./tokens/Token";
import { EvalToken } from "./tokens/EvalToken";
import { InfixExpression } from "./InfixExpression";
import { ScalarToken } from "./tokens/ScalarToken";
import { OperatorToken } from "./tokens/OperatorToken";
import { FunctionToken } from "./tokens/FunctionToken";
import { EnclosureToken } from "./tokens/EnclosureToken";
import { Scope } from "./Scope";

export class PostfixExpression {
    private infixExpression : InfixExpression;
    private tokens : Array<Token>;

    constructor(infixString : string) {
        this.infixExpression = new InfixExpression(infixString);
        this.tokens = this.infixToPostfix(this.infixExpression.getTokens());
    }

    private getAssociativity(token : Token) : number {
        if(token instanceof OperatorToken) {
            return (token as OperatorToken).getAssociativity();
        } else if (token instanceof FunctionToken) {
            return OperatorToken.ASSOCIATIVITY.RIGHT;
        } else {
            return Number.NaN;
        }
    }

    private getPrecedence(token : Token) : number {
        if(token instanceof OperatorToken) {
            return (token as OperatorToken).getPrecidence();
        } else if(token instanceof FunctionToken) {
            return 10;
        } else {
            return Number.NaN;
        }
    }

    public infixToPostfix(infixExpression : Array<Token>) : Array<Token> {
        let result = Array<Token>();

        let outputQueue = Array<Token>();
        let operatorsStack = Array<Token>();
        let token;
        for(let i = 0; i < infixExpression.length; i++) {
            token = infixExpression[i];

            if(token instanceof ScalarToken) {
                outputQueue.push(token);
            } else if(token instanceof OperatorToken) {
                let o1 = token;
                let o2 = operatorsStack[operatorsStack.length - 1];
                while((o2 instanceof OperatorToken || o2 instanceof FunctionToken) && (((o1.getAssociativity()) === ASSOC.Left && this.getPrecedence(o1) <= this.getPrecedence(o2)) 
                    || (this.getAssociativity(o1) === ASSOC.Right && this.getPrecedence(o1) < this.getPrecedence(o2)))) {
                    outputQueue.push(operatorsStack.pop() as Token);
                    o2 = operatorsStack[operatorsStack.length - 1];
                }
                operatorsStack.push(o1);
            } else if(token instanceof FunctionToken) {
                operatorsStack.push(token);
            } else if(token instanceof EnclosureToken) {
                if((token as EnclosureToken).getType() === EnclosureToken.TYPES.PAREN) {
                    if((token as EnclosureToken).getSide() === EnclosureToken.SIDES.OPEN) {
                        operatorsStack.push(token);
                    } else {
                        while((operatorsStack[operatorsStack.length - 1] as EnclosureToken).getSide() !== EnclosureToken.SIDES.OPEN) {
                            outputQueue.push(operatorsStack.pop() as Token);
                        }
                        operatorsStack.pop();
                    }
                } else {
                    throw "Only paren style enclosures are supported at this time";
                }
                
            } else {
                throw `Unknown token: ${token}`;
            }
        }

        return result;
    }

    public eval(scope : Scope) : Number {
        if(this.tokens.length < 1) {
            return Number.NaN;
        }
    
        let tempStack = Array<Token>();
        let i = this.tokens.length - 1;
        while(i > 0) {
            let token = this.tokens[i--];
    
            if(token instanceof OperatorToken) {
                // tempStack.pop(), tempStack.pop()
                tempStack.push(new ScalarToken((token as OperatorToken).eval(scope)));
            } else if(token instanceof FunctionToken) {
                let args = Array<Token>();
                for(let i = 0; i < (token as FunctionToken).getNumArguments(); i++) {
                    args.push(tempStack.pop() as Token);
                }
                tempStack.push(new ScalarToken((token as FunctionToken).eval(scope)));
            } else {
                tempStack.push(token)
            }
        }
    
        // TODO there should be some check that everything in a postfix expression must be evaluatable
        return (tempStack.pop() as EvalToken).eval(scope);
    }
}6