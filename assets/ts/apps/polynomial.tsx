import { createEffect, For, on, Show, Signal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Xterm } from "../lib/math/xterm";
import { c, events, graph, lowerTermsSignal, Term, upperTermsSignal } from "../constants";
import { DragController } from "../lib/misc/drag";
import { clearIntersections, findIntersections } from "./intersections";
import { debounce } from "../lib/misc/util";
import { NumInput } from "../lib/math/inputs";

const icon = <div class="app">
    <h1>41y = 67x</h1>
</div>;

const initPr = graph.init();

const dc = new DragController({
    touchEl: c
});

function fixOffset(zoom: number, mouseP: number, key: "scaleX" | "scaleY", posType: "x" | "y"): void {
    const oldScale: number = graph[key];
    const newScale = oldScale * zoom;

    graph[key] = newScale;

    const oldMouseGraph = graph.view[posType] + mouseP / oldScale;
    const newMouseGraph = oldMouseGraph - mouseP / newScale;

    graph.view[posType] = newMouseGraph;
}

initPr.then(() => {
    graph.resizeToContainer(c.getBoundingClientRect());

    graph.setView({
        x: 0,
        y: 1,
        maxX: 10,
        maxY: 11,
    });

    const zoom = 50;

    fixOffset(zoom, 0, "scaleX", "x");
    fixOffset(zoom, graph.canvasHeight, "scaleY", "y");

    graph.view.x = -4.5;
});

c.addEventListener("wheel", e => {
    e.preventDefault();

    const o = c.getBoundingClientRect();
    const mouseX = e.x - o.left;
    const mouseY = e.y - o.top;
    
    // 4 and 150 are sensitivity values
    const zoom = 4 ** (-e.deltaY / 150);

    fixOffset(zoom, mouseX, "scaleX", "x");
    fixOffset(zoom, mouseY, "scaleY", "y");

    const deltaXmultiplier = 1 / (1.5 ** (-e.deltaY / 150));
    graph.deltaX *= deltaXmultiplier;

    onChange();
}, {passive: false});

dc.onDrag = function(x, y) {
    graph.addDragMoveOffset(x, y);
    onChange();
};

export function onChange() {
    const upperArr: Xterm[] = Xterm.fromArr(upperTermsSignal[0]());
    const lowerArr: Xterm[] = Xterm.fromArr(lowerTermsSignal[0]());

    initPr.then(() => {
        graph.clearGraph();
        graph.graphTerms(upperArr, {color: 0x0000ff, width: 5});
        graph.graphTerms(lowerArr);
        
        debounce(() => findIntersections(), 200);

        events.emit("update");
        events.emit("polynomialChange");
    });
}

function PolynomialInput(props: {
    label: string,
    termSignal: Signal<Term[]>
}): JSX.Element {
    const [getTerms, setTerms] = props.termSignal;

    createEffect(on(getTerms, () => {
        // polynomial changed
        clearIntersections();
        onChange();
    }));

    return <div class="equation-c">
        <p>{props.label}</p>
        <br />
        <span class="equation">
            <p class="y-var">y = </p>
            <For each={getTerms()}>{([coef, exp], i) => 
                <span class="term">
                    <Show when={i() != 0}>
                        <p>+</p>
                    </Show>
                    <NumInput step="any" value={coef} placeholder="coeffecient"
                    onInput={newCoef => setTerms(arr => {
                        arr[i()][0] = newCoef;
                        onChange();
                        return arr;
                    })} />
                    <p>
                        x
                        <sup>
                            <NumInput step="1" value={exp} max={10} placeholder="exponent"
                            onInput={newExp => setTerms(arr => {
                                arr[i()][1] = newExp;
                                onChange();
                                return arr;
                            })} />
                        </sup>
                    </p>
                </span>
            }</For>
            <span>
                <button onclick={() => setTerms([...(getTerms()), [1, 2]])}>Add Term</button>
                <button onclick={() => setTerms(a => {
                    if(a.length <= 1) {
                        alert("Can't delete the first term");
                        return a;
                    }

                    return a.slice(0, -1);
                })}>Remove Term</button>
            </span>
        </span>
        <br />
    </div>;
}

const page = <div class="polynomial-page">
    <p>Polynomial Graph</p>
    <br />

    <PolynomialInput label="Upper bound" termSignal={upperTermsSignal} />
    <PolynomialInput label="Lower bound" termSignal={lowerTermsSignal} />

    {/* <span class="equation">
        <p id="y-var">y = </p>
        <For each={getTerms()}>{([coef, exp], i) => 
            <span class="term">
                <Show when={i() != 0}>
                    <p>+</p>
                </Show>
                <NumInput value={coef} placeholder="coeffecient"
                onInput={newCoef => setTerms(arr => {
                    arr[i()][0] = newCoef;
                    return arr;
                })} />
                <p>
                    x
                    <sup>
                        <NumInput value={exp} max={10} placeholder="exponent"
                        onInput={newExp => setTerms(arr => {
                            arr[i()][1] = newExp;
                            return arr;
                        })} />
                    </sup>
                </p>
            </span>
        }</For>
        <span>
            <button onclick={() => setTerms([...(getTerms()), [1, 2]])}>Add Term</button>
            <button onclick={() => setTerms(a => {
                if(a.length <= 1) {
                    alert("Can't delete the first term");
                    return a;
                }

                return a.slice(0, -1);
            })}>Remove Term</button>
        </span>
    </span> */}
</div>

export function initPolynomialApp(): [JSX.Element, JSX.Element] {
    return [icon, page];
}