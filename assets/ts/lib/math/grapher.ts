import { Application, Container, Graphics } from "pixi.js";
import { Xterm } from "./tokenizer";
import { floorToMultiples, XYarr, XYminMax, XYWH } from "../misc/util";

export abstract class Grapher {
    app: Promise<Application>;

    g = new Graphics();

    view: XYminMax = {
        x: 0,
        y: 0,
        maxX: 0,
        maxY: 0,
    };

    scaleX = 1;
    scaleY = 1;

    deltaX = .05;

    groups = {
        grid: new Container(),
        axes: new Container(),
        numbers: new Container(),
        graph: new Container(),
    };

    canvasHeight = 0;
    canvasWidth = 0;

    async init() {
        const app = await this.app;

        for(const i in this.groups) {
            const c = this.groups[i] as Container;
            app.stage.addChild(c);
        }

        const co = app.canvas.getBoundingClientRect();
        this.canvasHeight = co.height;
        this.canvasWidth = co.width;

        this.groups.graph.addChild(this.g);
    }



    constructor(app: Promise<Application>) {
        this.app = app;

        this.g.strokeStyle = {
            width: 2,
            color: 0xff0000,
            alpha: 1
        };

    }

    line(x: number, y: number, x2: number, y2: number) {
        this.g.moveTo(x, y);
        this.g.lineTo(x2, y2);
    }

    resizeToContainer(o: DOMRect) {
        this.view.maxX = o.right - o.x;
        this.view.maxY = o.bottom - o.y;
    }

    addDragMoveOffset(x: number, y: number) {
        x /= this.scaleX;
        y /= this.scaleY;
        this.view.x += x;
        this.view.maxX += x;
        this.view.y += y;
        this.view.maxY += y;
    }

    vertLine(x: number) {
        this.line(x, 0, x, this.canvasHeight);
    }

    horzLine(y: number) {
        this.line(0, y, this.canvasWidth, y);
    }

    private drawAxis() {
        const [x0, y0] = this.applyTransformations(0, 0);

        // x-axis: y = 0
        this.line(0, y0, innerWidth, y0);
        
        // y-axis: x = 0
        this.line(x0, innerHeight, x0, 0);

        this.g.stroke({
            width: 5,
            color: 0,
        });
    }

    abstract drawUnitLines();

    clearGraph() {
        this.g.clear();
        this.drawAxis();
        this.drawUnitLines();
    }

    drawPoint(x: number, y: number) {
        this.g.circle(x, y, 20)
        .fill("yellow");
    }

    private drawViewbox() {
        const o = this.view;

        this.line(o.x, o.y, o.maxX, o.y);
        this.line(o.x, o.maxY, o.maxX, o.maxY);
        this.line(o.x, o.y, o.x, o.maxY);
        this.line(o.maxX, o.y, o.maxX, o.maxY);
    }

    private convY(y: number): number {
        return this.canvasHeight * this.scaleY - y;
    }

    applyXtransformation(x: number): number {
        return (x - this.view.x) * this.scaleX;
    }

    applyYtransformation(y: number): number {
        return this.convY((y + this.view.y) * this.scaleY);
    }

    dot(x: number, y: number, r: number) {
        this.g.circle(x, y, r);
    }

    applyTransformations(x: number, y: number): XYarr {
        return [
            this.applyXtransformation(x),
            this.applyYtransformation(y),
        ];
    }

    setView(o: XYminMax) {
        this.view.x = o.x;
        this.view.y = o.y;
    }

    abstract findIntersections(a: Xterm[], b: Xterm[]);

    getXYvaluesOfTheView(terms: Xterm[], deltaX: number, scale = 100): XYarr[] {
        return Xterm.GetXYvaluesFromTermsOnSomeRange
        (this.view.x - deltaX, this.view.maxX, deltaX, terms, scale);
    }

    graphTerms(terms: Xterm[], scale = 100) {
        const arr = this.getXYvaluesOfTheView(terms, this.deltaX, scale);
        // const arr = Xterm.GetXYvaluesFromTermsOnSomeRange
        // (this.view.x - this.deltaX, this.view.maxX, this.deltaX, terms, scale);

        const margin = 5 * this.scaleY;

        var lastX = 0;
        var lastY: number | undefined = undefined;
        for(let [rawX, rawY] of arr) {
            const [x, y] = this.applyTransformations(rawX, rawY);

            if(lastY) {
                if(lastY > this.canvasHeight + margin
                && y > this.canvasHeight + margin
                || lastY < -margin
                && y < -margin) continue;

                this.line(lastX, lastY, x, y);
                this.g.stroke({color: "red", width: 5});
            }

            lastX = x;
            lastY = y;
        }
    }
}