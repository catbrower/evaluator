import { EvalToken } from "./EvalToken";
import { Scope } from "../Scope";

export abstract class FunctionToken extends EvalToken {
    public static new(name : string, num_arguments : Number, evalFunc : Function) : FunctionToken {
        class FunctionTokenDerived extends FunctionToken {
            public eval(scope : Scope) : Number {
                return evalFunc(scope);
            }
        }

        return new FunctionTokenDerived(name, num_arguments);
    }

    private num_arguments : Number;

    constructor(name : string, num_arguments : Number) {
        super(name);
        this.num_arguments = num_arguments;
    }

    public getNumArguments() : Number {
        return this.num_arguments;
    }

    abstract eval(scope : Scope): Number;
}