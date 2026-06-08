import { graph } from "../../constants";
import { XYarr } from "../misc/util";
import { clusterNumbers, clusterNumbersAndGetMeans } from "./clusterNumbers";
import { Grapher } from "./grapher";
import { Xterm } from "./tokenizer";
import { getRealSortedValuesOfNewtonsMethodOnXYArr } from "./newtonsMethod";

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
        const hasNegativePowers = Xterm.hasNegativePowers(a)
        || Xterm.hasNegativePowers(b);

        const xyArr: XYarr[] = this.getXYvaluesOfTheView(xR, graph.deltaX * 20);

        const maxStep = (this.view.maxX - this.view.x) / 15;

        var guesses: number[];

        if(hasNegativePowers) {
            const posArr = xyArr.filter(([x, y]) => x > 0);
            const negArr = xyArr.filter(([x, y]) => x < 0);
            const posGuesses = 
            getRealSortedValuesOfNewtonsMethodOnXYArr(posArr, xR, xRprime, maxStep);
            const negGuesses = 
            getRealSortedValuesOfNewtonsMethodOnXYArr(negArr, xR, xRprime, maxStep);
            
            guesses = [...negGuesses, ...posGuesses];
        } else {
            guesses = getRealSortedValuesOfNewtonsMethodOnXYArr(xyArr, xR, xRprime, maxStep);
        }

        const roots = clusterNumbersAndGetMeans(guesses, 1e-6);

        return roots;
    }
}
