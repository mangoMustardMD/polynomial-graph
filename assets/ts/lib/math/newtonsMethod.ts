import { XYarr } from "../misc/util";
import { Xterm } from "./tokenizer";
import { keepRealNumsInArr } from "./util";

function useNewtonsMethod
(x: number, maxStep: number, rx: Xterm[], rxPrime: Xterm[]): number | undefined {
    var approxXval = x;
    const valOfXrPrime = Xterm.getYvalueOfTerms(approxXval, rxPrime);
    if(valOfXrPrime == 0 || !Number.isFinite(valOfXrPrime)) 
        return undefined;

    const fDividedByFprime = Xterm.getYvalueOfTerms(approxXval, rx) / valOfXrPrime;

    const clampedFdividedByFprime = 
    Math.sign(fDividedByFprime) * Math.min(Math.abs(fDividedByFprime), maxStep);

    approxXval -= clampedFdividedByFprime;
    return approxXval;
}

export function useNewtonsMethodOnXYarr
(xyArr: XYarr[], rx: Xterm[], rxPrime: Xterm[], maxStep: number): number[] {
    const guesses: number[] = [];
    outer: for(const [x, y] of xyArr) {
        var approxXval = x;

        for(let i = 0; i < 15; i++) {
            const newVal = useNewtonsMethod(approxXval, maxStep, rx, rxPrime);
            if(newVal === undefined) continue outer;

            if(Math.abs(Math.abs(newVal) - Math.abs(approxXval)) < 1e-6) break;
            
            approxXval = newVal;
        }

        guesses.push(approxXval);
    }

    return guesses;
}

export function getRealSortedValuesOfNewtonsMethodOnXYArr
(xyArr: XYarr[], rx: Xterm[], rxPrime: Xterm[], maxStep: number): number[] {
    const arr = keepRealNumsInArr
    (useNewtonsMethodOnXYarr(xyArr, rx, rxPrime, maxStep));
    arr.sort((a, b) => a - b);

    return arr;
}