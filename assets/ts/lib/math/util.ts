import { Interval } from "../../constants";
import { round } from "../misc/util";
import { Xterm } from "./tokenizer";

export function keepRealNumsInArr(arr: number[]): number[] {
    const reals: number[] = [];
    for(const n of arr)
        if(isReal(n)) reals.push(n);

    return reals;
}

export function isReal(n: number): boolean {
    return Number.isFinite(n) && !Number.isNaN(n);
}

export function getMeansOfNumMap(map: Map<number, number[]>): number[] {
    const roots: number[] = [];

    for (const [startN, arr] of map) {
        var addedN = 0;

        for (const n of arr) addedN += n;
        const avg = addedN / arr.length;

        if (!isReal(avg)) continue;
        roots.push(avg);
    }

    return roots;
}

export function standardRoundNumber(n: number): number {
    if(Math.abs(n) < 1e-6) return 0;

    const r = round(n, 10e5);
    if(Number.isFinite(r)) return r;
    else return n;
}

export function transformNumArr(
    arr: number[], 
    f: (n: number, i: number) => number | undefined
): number[] {
    const out: number[] = [];

    for(const i in arr) {
        const val = f(arr[i], Number(i));
        if(val) out.push(val);
    }

    return out;
}

export function standardRoundArr(arr: number[]): number[] {
    return transformNumArr(arr, n => standardRoundNumber(n));
}

console.log(splitIntervalsByPoints(-5, 10, [-0.43, 0.43]));

export function splitIntervalsByPoints(a: number, b: number, points: number[]): Interval[] {
    if(points.length < 1) return [[a, b]];
    const arr: Interval[] = [];
    
    points.sort((a, b) => a - b);
    var lastPoint = a;

    for(const point of points) {
        const isPointTooSmall = point < a;
        const isPointTooBig = point > b;
        if(isPointTooSmall || isPointTooBig) continue;

        arr.push([lastPoint, point]);
        lastPoint = point;
    }

    arr.push([lastPoint, b]);

    return arr;
}

export function calculateDiskVolume
(a: number, b: number, Rx: Xterm[]): number {
    const RxSquared = Xterm.squareTerms(Rx);
    const integral = Xterm.getIntegralOfTerms(RxSquared);

    const output = Math.PI * (
        Xterm.getYvalueOfTerms(b, integral) 
        - Xterm.getYvalueOfTerms(a, integral)
    );

    return output;
}
