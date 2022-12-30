import { Token } from "./tokens/Token";
import { TokenFactory } from "./tokens/TokenFactory";

export class InfixExpression {
   // TODO this could be cleaned up a bit, maybe derive this from the TokenFactory
   // so if a new operator is added I don't have to remember to add it here
   private static tokenRegex = RegExp(/([\+\-\*\/\^\(\)])/);
   private stringExpression : string;
   private tokens : Array<Token>;

   constructor(stringExpression : string) {
      this.stringExpression = stringExpression;
      this.tokens = this.parse(stringExpression);
   }

   private parse(stringExpression : string) : Array<Token> {
      let result = new Array<Token>();

      let tokens = stringExpression.split(/s+/g);
      for(let token of tokens) {
         token = token.replace(/s+/g, "");
         if(token != "") {
            result.push(TokenFactory.build(token));
         }
      }

      return result;
   }

   public getTokens() : Array<Token> {
      return this.tokens;
   }

   public toString() : string {
      return this.stringExpression;
   }
}