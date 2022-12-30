import { Token } from "./Token";
import { EnclosureToken } from "./EnclosureToken";
import { OperatorToken } from "./OperatorToken";
import { Scope } from "../Scope";
import { ScalarToken } from "./ScalarToken";
import { FunctionToken } from "./FunctionToken";

export class TokenFactory {
    private static STRING_REGEXP : RegExp = new RegExp(/^[0-9]+|\.?[0-9]+$/);

    private static ENCLOSURES : { [key: string] : Function } = {
        "(": () => { new EnclosureToken("(", EnclosureToken.TYPES.PAREN, EnclosureToken.SIDES.OPEN) },
        ")": () => { new EnclosureToken(")", EnclosureToken.TYPES.PAREN, EnclosureToken.SIDES.CLOSE) }
    }
    
    private static OPERATORS : { [key: string] : Function }= {
        "^": () => OperatorToken.new("^", OperatorToken.ASSOCIATIVITY.RIGHT, 4, (scope : Scope) : Number => { return Math.pow(scope.get('argv')[1], scope.get('argv')[0]) }),
        "/": () => OperatorToken.new("/", OperatorToken.ASSOCIATIVITY.LEFT,  3, (scope : Scope) : Number => { return scope.get('argv')[1] / scope.get('argv')[0] }),
        "*": () => OperatorToken.new("*", OperatorToken.ASSOCIATIVITY.LEFT,  3, (scope : Scope) : Number => { return scope.get('argv')[1] * scope.get('argv')[0] }),
        "+": () => OperatorToken.new("+", OperatorToken.ASSOCIATIVITY.LEFT,  2, (scope : Scope) : Number => { return scope.get('argv')[1] + scope.get('argv')[0] }),
        "-": () => OperatorToken.new("-", OperatorToken.ASSOCIATIVITY.LEFT,  2, (scope : Scope) : Number => { return scope.get('argv')[1] - scope.get('argv')[0] })
    }
    
    private static FUNCTIONS : { [key: string] : Function}= {
        "sin": () => FunctionToken.new("sin", 1, (scope : Scope) => {Math.sin(scope.get('argv')[0])}),
        "cos": () => FunctionToken.new("cos", 1, (scope : Scope) => {Math.cos(scope.get('argv')[0])}),
        "tan": () => FunctionToken.new("tan", 1, (scope : Scope) => {Math.tan(scope.get('argv')[0])}),
        "log": () => FunctionToken.new("log", 1, (scope : Scope) => {Math.log(scope.get('argv')[0])})
    }

    private static isNumber(name : string) : boolean {
        return this.STRING_REGEXP.test(name);
    }

    // TODO variables have to be ignored until scope is working
    static build(name : string) : Token {
        if(this.isNumber(name)) {
            return new ScalarToken(Number.parseFloat(name));
        } else if(name in this.ENCLOSURES) {
            return this.ENCLOSURES[name]() as EnclosureToken;
        } else if(name in this.OPERATORS) {
            return this.OPERATORS[name]() as OperatorToken;
        } else if(name in this.FUNCTIONS) {
            return this.FUNCTIONS[name]() as FunctionToken;
        } else {
            throw `Unknown token: ${name}`;
        }
    }
}