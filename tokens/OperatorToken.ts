import { EvalToken } from "./EvalToken";
import { Scope } from "../Scope";

export abstract class OperatorToken extends EvalToken {
    public static new(name : string, associativity : number, precedence : number, evalFunc : Function) : OperatorToken {
        class OperatorTokenDerived extends OperatorToken {
            public eval(scope : Scope) : number {
                return evalFunc(scope);
            }
        }

        return new OperatorTokenDerived(name, associativity, precedence);
    }

    public static ASSOCIATIVITY = {
        LEFT: 0,
        RIGHT: 1
    }

    private precedence : number;
    private associativity: number;

    constructor(name : string, associativity : number, precidence : number) {
        super(name);
        this.associativity = associativity;
        this.precedence = precidence;
    }

    public getAssociativity() : number {
        return this.associativity;
    }

    public getPrecidence() : number {
        return this.precedence;
    }
}