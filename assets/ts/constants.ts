import { Application, EventEmitter } from "pixi.js";
import { $, $$ } from "./lib/misc/util";
import { GrapherWithGrids } from "./lib/math/grids";
import { createSignal } from "solid-js";

export const mainDiv = $("#main") as HTMLDivElement;
export const c = $$("canvas", {
    attrs: {
        id: "c"
    },
    text: "ERROR: This app is not supported in this browser"
});

export var appPrRes: () => void;
export const appPr: Promise<Application> = new Promise<Application>(res => {
    const app = new Application();

    appPrRes = async function() {
        const e = $("#cc");
        await app.init({
            background: "#eee",
            antialias: true,
            autoDensity: true,
            powerPreference: "high-performance",
            resolution: devicePixelRatio,
            canvas: c,
            roundPixels: true,
            preference: "webgl",
            resizeTo: e
        });
        res(app);
    };
});

export const graph = new GrapherWithGrids(appPr);

export type Coeffecient = number;
export type Exponent = number;
export type Term = [Coeffecient, Exponent];
export type Interval = [number, number];

export const upperTermsSignal = createSignal<Term[]>([[-1, -1]]);
export const lowerTermsSignal = createSignal<Term[]>([[0, 0]]);

export const events = new EventEmitter<"update" | "polynomialChange">();