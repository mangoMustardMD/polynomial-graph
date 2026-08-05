import { JSX } from "solid-js/jsx-runtime";
import { appPr, graph, lowerTermsSignal, upperTermsSignal } from "../constants";
import { createSignal, For, Show } from "solid-js";
import { XYarr } from "../lib/misc/util";
import { Xterm } from "../lib/math/xterm";
import { isReal, standardRoundArr } from "../lib/math/util";

const icon = <div class="app">
    <h1>R(x)=0</h1>
</div>;

const [getIntersections, setIntersections] = createSignal<XYarr[]>([]);
const [getClickState, setClickState] = createSignal<boolean>(false);

export function clearIntersections() {
    setClickState(false);
    setIntersections([]);
}

const page = <div class="intersections-page">
    <Show when={getClickState()}>
        <div class="card">
            <Show when={getIntersections().length > 0} fallback={
                <p>No intersections found</p>
            }>
                <p>Found intersections:</p>
                <ul>
                    <For each={getIntersections()}>{
                        arr => {
                            let [x, y] = standardRoundArr(arr);
                            if(!isReal(y)) y = 0;

                            return <li>({x}, {y})</li>;
                        }
                    }</For>
                </ul>
            </Show>
        </div>
    </Show>
</div>;

export function findIntersections() {
    const rootsArr = graph.findIntersections(
        Xterm.fromArr(upperTermsSignal[0]()), 
        Xterm.fromArr(lowerTermsSignal[0]())
    );

    const xyArr = Xterm.getXYvaluesFromXarr
    (rootsArr, Xterm.fromArr(upperTermsSignal[0]()));     

    setIntersections(xyArr);
    setClickState(true);

    for(const [x, y] of xyArr) {
        graph.dot(...graph.applyTransformations(x, y), 10);
        graph.g.stroke({
            color: 0x0000ff,
            width: 3,
        });
    }
}

export function initIntersectionsApp(): [JSX.Element, JSX.Element] {
    return [icon, page];
}