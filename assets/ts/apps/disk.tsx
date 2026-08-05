import { JSX } from "solid-js/jsx-runtime";
import { NumInput } from "../lib/math/inputs";
import { createSignal, Show } from "solid-js";
import { events, graph, Interval, lowerTermsSignal, Term, upperTermsSignal } from "../constants";
import { Xterm } from "../lib/math/xterm";
import { calculateDiskVolume, isReal, splitIntervalsByPoints } from "../lib/math/util";
import { onChange } from "./polynomial";
import { round } from "../lib/misc/util";

const icon = <div class="app">
    <h2>Disk Rotate</h2>
</div>;

const [getErrMsg, setErrMsg] = createSignal<string | undefined>();
const [getChangeState, setChangeState] = createSignal(false);
const [getNumsSameState, setNumsSameState] = createSignal(true);
const [getVolume, setVolume] = createSignal(0);
const [getVolumeWoutPi, setVolumeWoutPi] = createSignal(0);

var aN: number = 0;
var bN: number = 0;

events.addListener("update", () => {
    if(!getChangeState()) return;

    graph.vertLine(graph.applyXtransformation(aN));
    graph.g.stroke({
        width: 5,
        color: "green"
    });
    graph.vertLine(graph.applyXtransformation(bN));
    graph.g.stroke({
        width: 5,
        color: "green"
    });
});

function arePolynomialsInvalid(Rx: Xterm[], interval: Interval): false | string {
    const [a, b] = interval;
    const midX = a + (b - a) / 2;    

    const ay = Xterm.getYvalueOfTerms(a, Rx);
    const by = Xterm.getYvalueOfTerms(b, Rx);
    const midY = Xterm.getYvalueOfTerms(midX, Rx);

    if(!isReal(ay)) return "Found an invalid start point at x = " + a;
    if(!isReal(by)) return "Found an invalid endpoint at x = " + b;
    if(!isReal(midY)) return "Given range must be continious and differentiable";

    const isOrientedCorrect = ay > -1e-6
    && by > -1e-6
    && midY > -1e-6;

    if(!isOrientedCorrect) return "The upper polynomial must be "
    + "above the lower polynomial in the given range";

    return false;
}

function update() {
    events.emit("update");
    onChange();
    setNumsSameState(aN === bN);
    setChangeState(true);
    if(getNumsSameState()) return;

    const upperTerms = upperTermsSignal[0]();
    const lowerTerms = lowerTermsSignal[0]();
    const Rx = Xterm.subtractPolynomials(
        Xterm.fromArr(upperTerms), 
        Xterm.fromArr(lowerTerms)
    );

    const intersections: number[] =
    graph.findIntersections(
        Xterm.fromArr(upperTerms), 
        Xterm.fromArr(lowerTerms),
        Xterm.GetXYvaluesFromTermsOnSomeRange(
            aN,
            bN, 
            Math.abs(bN - aN) / 100, 
            Rx
        )
    );

    const intervals: Interval[] = splitIntervalsByPoints(aN, bN, intersections);

    for(const interval of intervals) {
        const errMsg = arePolynomialsInvalid(Rx, interval);
        if(errMsg) return setErrMsg(errMsg);
    }
    
    setErrMsg();
    getDiskVolume();
}

function getDiskVolume() {
    const upperTerms = upperTermsSignal[0]();
    const lowerTerms = lowerTermsSignal[0]();

    const Rx = Xterm.subtractPolynomials(
        Xterm.fromArr(upperTerms), 
        Xterm.fromArr(lowerTerms)
    );

    const val = calculateDiskVolume(aN, bN, Rx);

    setVolume(val);
    setVolumeWoutPi(val / Math.PI);
}

events.on("polynomialChange", () => getDiskVolume());

const page = <div class="disk-page">
    <p>
        This shows the volume when the equations 
        are revolved around the x-axis
    </p>
    <br />
    <p>
        Enter the range:
    </p>
    <span>
        (
        <NumInput 
            value={0} 
            placeholder="a" 
            step="any"
            onInput={n => {
                aN = n; 
                update();
            }} />
        <NumInput 
            value={0} 
            placeholder="b" 
            step="any"
            onInput={n => {
                bN = n; 
                update();
            }} />
        )
    </span>
    <hr />
    <br />
    <Show fallback={
        <p>Enter the range to see the calculated volume</p>
    } when={getChangeState()}>
        <Show when={getNumsSameState()}>
            <p>
                Make sure the interval isn't on the same number.
                Otherwise, the volume is 0
            </p>
            <br />
        </Show>
        <Show fallback={
            <p>ERROR: {getErrMsg()}</p>
        } when={!getErrMsg()}>
            <p>Calculated volume:</p>
            <p>{(() => {
                const n = getVolume();
                if(n === 0) return "(No value)";
                else return "= " + round(n, 1e5);
            })()}</p>
            <p>{(() => {
                const n = getVolumeWoutPi();
                if(n === 0) return "(No value)";
                else return "= " + round(n, 1e5) + "π";
            })()}</p>
        </Show>
    </Show>
</div>;

export function initDiskApp(): [JSX.Element, JSX.Element] {
    return [icon, page];
}