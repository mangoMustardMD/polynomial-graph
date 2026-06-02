import { graph } from "../../constants";
import { XYarr } from "../misc/util";
import { clusterNumbers, clusterNumbersAndGetMeans } from "./clusterNumbers";
import { getMeansOfNumMap, isReal, keepRealNumsInArr, standardRoundArr, standardRoundNumber } from "./util";
import { Grapher } from "./grapher";
import { Xterm } from "./tokenizer";

type Stop = boolean;

export class GrapherWithGrids extends Grapher {
    private loopScreenWidth(dx: number, f: (rx: number, x: number) => Stop | undefined) {
        for(
            let x = 0, tx = 0; 
            tx <= this.canvasWidth; 
            x += dx, tx = this.applyXtransformation(x)
        ) {
            const needsToStop = f(x, tx);
            if(needsToStop) return;
        }

        for(
            let x = 0, tx = 0; 
            tx >= -this.canvasWidth; 
            x -= dx, tx = this.applyXtransformation(x)
        ) {
            const needsToStop = f(x, tx);
            if(needsToStop) return;
        }
    }

    private loopScreenHeight(dy: number, f: (ry: number, y: number) => Stop | undefined) {
        for(
            let y = 0, ty = 0; 
            ty <= this.canvasHeight; 
            y -= dy, ty = this.applyYtransformation(y)
        ) {
            const needsToStop = f(y, ty);
            if(needsToStop) return;
        }

        for(
            let y = 0, ty = 0; 
            ty >= -this.canvasHeight; 
            y += dy, ty = this.applyYtransformation(y)
        ) {
            const needsToStop = f(y, ty);
            if(needsToStop) return;
        }
    }

    drawUnitLines() {
        this.loopScreenWidth(1, (rx, x) => {
            this.vertLine(x);
        });

        this.loopScreenHeight(1, (ry, y) => {
            this.horzLine(y);
        });

        this.g.stroke({
            width: 2,
            color: 0,
        });
    }

    findIntersections(a: Xterm[], b: Xterm[]): number[] {
        // R(x) = 0
        const xR = Xterm.subtractPolynomials(a, b);
        const xRprime = Xterm.getDerivativesOfTerms(xR);

        const xyArr: XYarr[] = this.getXYvaluesOfTheView(xR, graph.deltaX * 40);

        const guesses: number[] = [];

        for(const [x, y] of xyArr) {
            var approxXval = x;

            for(let i = 0; i < 15; i++) {
                approxXval -= 
                Xterm.getYvalueOfTerms(approxXval, xR) / Xterm.getYvalueOfTerms(approxXval, xRprime);
            }

            guesses.push(approxXval);
        }

        const realGuesses: number[] = keepRealNumsInArr(guesses);
        realGuesses.sort((a, b) => a - b);

        const roots = clusterNumbersAndGetMeans(realGuesses, 1e-6);

        return roots;
    }
}

// this should be near a y-value of 0
        // {
        //     var currentValTo0 = Infinity;
        //     for(const [x, y] of xyArr) {
        //         const valTo0 = Math.abs(y);

        //         if(isFinite(currentValTo0)) {
        //             if(currentValTo0 - valTo0) {

        //             }
        //         } else if(valTo0 < currentValTo0) {
        //             xGuess = x;
        //             currentValTo0 = valTo0;
        //         }
        //     }
        // }