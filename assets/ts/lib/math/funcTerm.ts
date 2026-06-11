import { BasicTerm } from "./basicTerm";
import { Xterm } from "./tokenizer";

export const mathFuncs: 
Record<"ln", (n: number) => number> = {
    ln: n => Math.log(n)
};

export abstract class AbstractFuncTerm extends BasicTerm {
    funcType: keyof typeof mathFuncs;

    constructor(coef: number, power: number, funcType: keyof typeof mathFuncs) {
        super(coef, power);
        this.funcType = funcType;
    }

    private getFuncVal(x: number): number {
        return mathFuncs[this.funcType](x);
    }

    override getScaledYvalue(x: number, scale = 100): number {
        return (this.coeffecient * ((this.getFuncVal(x) ** this.power) * scale));
    }
}

export class LnFuncTerm extends AbstractFuncTerm {
    constructor(coef: number, power: number) {
        super(coef, power, "ln");
    }
}

