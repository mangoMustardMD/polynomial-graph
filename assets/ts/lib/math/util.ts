import { round } from "../misc/util";

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
    const r = round(n, 10e8);
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