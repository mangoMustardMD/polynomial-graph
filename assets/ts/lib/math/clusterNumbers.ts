import { getMeansOfNumMap, keepRealNumsInArr } from "./util";

export function clusterNumbers(arr: number[], tolerance: number): Map<number, number[]> {
    const clusters = new Map<number, number[]>([]);

    for(const n of arr) {
        var foundCluster = false;

        inner: for(const [clusterVal] of clusters) {
            if(Math.abs(n - clusterVal) <= tolerance) {
                const arr = clusters.get(clusterVal);
                if(arr) arr.push(n);

                foundCluster = true;
                break inner;
            }
        }

        if(!foundCluster) clusters.set(n, []);
    }

    return clusters;
}

export function clusterNumbersAndGetMeans(arr: number[], tolerance: number) {
    const cluster: Map<number, number[]> = clusterNumbers(arr, tolerance);
    const roots: number[] = getMeansOfNumMap(cluster);

    return roots;
}