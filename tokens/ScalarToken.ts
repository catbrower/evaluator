import { EvalToken } from "./EvalToken";
import { Scope } from "../Scope";

export class ScalarToken extends EvalToken {
    private value : Number;

    constructor(value : Number) {
        super(`${value}`);
        this.value = value;
    }

    public eval(scope : Scope) : Number {
        return this.value;
    }
}