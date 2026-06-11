import { Coeffecient, Exponent, Term } from "../../constants";
import { wait, XYarr } from "../misc/util";
import { BasicTerm } from "./basicTerm";
import { AbstractFuncTerm, LnFuncTerm } from "./funcTerm";

type PossibleTerm = Xterm | undefined;

export type PolynomialMap = Map<Exponent, Xterm>;

export class Xterm extends BasicTerm {
    add(t: Xterm): PossibleTerm {
        if(this.power == t.power) 
            return new Xterm(this.coeffecient + t.coeffecient, this.power);
    }

    getDerivative(): Xterm {
        return new Xterm(this.coeffecient * this.power, this.power - 1);
    }

    subtractBy(t: Xterm): PossibleTerm {
        if(this.power == t.power) 
            return new Xterm(this.coeffecient - t.coeffecient, this.power);
    }

    static mapTerms(arr: Xterm[]): Map<number, Xterm[]> {
        const powerMap = new Map<number, Xterm[]>();
        for(const term of arr) {
            const pow = term.power;
            const terms = powerMap.get(pow);

            if(!terms) powerMap.set(pow, [term]);
            else terms.push(term);
        }

        return powerMap;
    }

    static fromArr([coeffecient, power]: [number, number]): Xterm;

    static fromArr(arr: [number, number][]): Xterm[];

    static fromArr(o: [number, number] | [number, number][]): Xterm | Xterm[] {
        if(Array.isArray(o[0])) {
            const arr = o as [number, number][];
            const newArr: Xterm[] = [];

            for(const [coef, power] of arr) newArr.push(new Xterm(coef, power));
            return newArr;
        } else {
            const [coef, power] = o as [number, number];
            return new Xterm(coef, power)
        }
    }

    static getYvalueOfTerms(x: number, terms: (Xterm | AbstractFuncTerm)[], scale = 100): number {
        var scaledY = 0;

        for(const term of terms) {
            if(term.power < 0 && Math.abs(x) < 1e-6)
                return NaN;

            const result = term.getScaledYvalue(x, scale);

            scaledY += result;
        }

        return scaledY / scale;
    }

    static getDerivativesOfTerms(terms: Xterm[]): Xterm[] {
        const arr: Xterm[] = [];

        for(const term of terms)
            arr.push(term.getDerivative());
        
        return arr;
    }

    static convertToXYstring(x: number, y: number) {
        return `(${x}, ${y})`;
    }

    static getXYpointFromTermsAsString(x: number, terms: Xterm[], scale = 100): string {
        const y = this.getYvalueOfTerms(x, terms, scale);

        return this.convertToXYstring(x, y);
    }

    static logXYpointFromTerms(x: number, terms: Xterm[], scale = 100): void {
        console.log(this.getXYpointFromTermsAsString(x, terms, scale));
    }

    static GetXYvaluesFromTermsOnSomeRange
    (xMin: number, xMax: number, deltaX: number, terms: Xterm[], scale = 100): 
    XYarr[] {
        const final: XYarr[] = [];

        for(let x = xMin; x < xMax; x += deltaX) {
            const y = this.getYvalueOfTerms(x, terms, scale);
            final.push([x, y]);
        }

        return final;
    }

    static forEachOfSamePower(
        a: Xterm[], 
        b: Xterm[], 
        f: (a: Coeffecient, b: Coeffecient, power: Exponent) => Coeffecient
    ): Term[] {
        const powerMap: Map<Exponent, Coeffecient> = new Map();

        for(const term of a) {
            const {coeffecient, power} = term;
            if(coeffecient == 0) continue;

            const powerEntry = powerMap.get(power);

            if(!powerEntry) powerMap.set(power, coeffecient);
            else powerMap.set(power, powerEntry + coeffecient);
        }

        for(const term of b) {
            const {coeffecient, power} = term;
            if(coeffecient == 0) continue;

            const powerEntry: Coeffecient | undefined = powerMap.get(power);

            if(!powerEntry) powerMap.set(power, f(0, coeffecient, power));
            else powerMap.set(power, f(powerEntry, coeffecient, power));
        }

        const arr: Term[] = [];
        for(const [power, coeffecient] of powerMap)
            arr.push([coeffecient, power]);
        
        return arr;
    }

    static getXYvaluesFromXarr(xArr: number[], terms: Xterm[]): XYarr[] {
        const xyArr: XYarr[] = [];

        for(const x of xArr) 
            xyArr.push([x, this.getYvalueOfTerms(x, terms)]);

        return xyArr;
    }

    isPowerNegative(): boolean {
        return this.power < 0;
    }

    static hasNegativePowers(arr: Xterm[]): boolean {
        for(const term of arr) 
            if(term.isPowerNegative())
                return true;

        return false;
    }

    static subtractPolynomials(a: Xterm[], b: Xterm[]): Xterm[] {
        const terms = this.forEachOfSamePower(a, b, (a, b) => a - b);
        
        return Xterm.fromArr(terms);
    }

    static dividePolynomials(a: Xterm[], b: Xterm[]): Xterm[] {
        const terms = this.forEachOfSamePower(a, b, (a, b) => {
            const d = a / b;
            if(b == 0) return a;
            else return d;
        });
        
        return Xterm.fromArr(terms);
    }

    static convertTermToVarStr(t: Term): string {
        return `${t[0]}x^${t[1]}`;
    }

    static convertTermArrToVarStr(arr: Term[]): string {
        var finalStr = "";
        for(const term of arr) {
            const str = this.convertTermToVarStr(term);
            if(finalStr.length == 0) finalStr += str;
            else {
                if(str[0] == "-") finalStr += (" " + str);
                else finalStr += (" + " + str);
            }
        }

        return finalStr;
    }

    getIntegral(): Xterm | AbstractFuncTerm  {
        if(this.power == -1) return new LnFuncTerm(this.coeffecient, 1);

        const nPlus1 = this.power+1;
        return new Xterm(this.coeffecient / nPlus1, nPlus1);
    }

    static getIntegralOfTerms(terms: Xterm[]): (Xterm | AbstractFuncTerm)[] {
        const arr: (Xterm | AbstractFuncTerm)[] = [];
        for(const term of terms) arr.push(term.getIntegral());
        return arr;
    }

    multiply(term: Xterm) {
        this.coeffecient *= term.coeffecient;
        this.power += term.power;
    }

    static squareTerms(terms: BasicTerm[]): Xterm[] {
        const output: Xterm[] = [];
        const a = terms;
        const b = terms;

        for(const outerTerm of a)
            for(const ib in b) {
                const innerTerm = b[ib];
                const term = new Xterm(
                    outerTerm.coeffecient * innerTerm.coeffecient, 
                    outerTerm.power + innerTerm.power
                );

                output.push(term);
            }
        
        return output;
    }
}
