export class Scope {
    private stack;
    private level : number;

    constructor() {
        this.stack = [1, 2, 3];
        this.level = 0;
    }

    public addVariable(name : string, newVar) {
        if(name in this.stack[this.level]) {
            throw `Variable "${name}" already declared`
        }

        this.stack[this.level][name] = newVar;
    }

    public get(name : String) {
        if(name === "argv") {
            return [0, 0, 0];
        }

        return [];
    }
}