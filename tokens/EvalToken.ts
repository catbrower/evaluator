import { Token } from "./Token";
import { Scope } from "../Scope";

export abstract class EvalToken extends Token {
    public abstract eval(scope : Scope) : Number;
}