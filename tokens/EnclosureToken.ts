import { Token } from "./Token";

export class EnclosureToken extends Token {
    static TYPES = {
        "PAREN": 0,
        "BRACKET": 1,
        "BRACE": 2
    }

    static SIDES = {
        "OPEN": 0,
        "CLOSE": 1
    }

    private type : Number;
    private side : Number;

    constructor(name : string, type : Number, side : Number) {
        super(name);
        this.type = type;
        this.side = side;
    }

    public getType() : Number {
        return this.type;
    }

    public getSide() : Number {
        return this.side;
    }
}