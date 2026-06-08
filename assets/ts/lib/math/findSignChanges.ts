import { XYarr } from "../misc/util";

export function findSignChangesOr0InXYarr(arr: XYarr[]): XYarr[] {
    const out: XYarr[] = [];

    for(let i = 0; i < arr.length-1; i++) {
        const nextN = arr[i+1];
        const n = arr[i];

        const nextSign = Math.sign(nextN[1]);
        const nSign = Math.sign(n[1]);

        if(nSign == 0 
        || nSign != nextSign) {
            out.push(n, nextN);
            i++;
            continue;
        }
    }

    return out;
}