import { render } from "solid-js/web";
import { $ } from "../lib/misc/util";
import { createSignal, Show } from "solid-js";

const [getTitle, setTitle] = createSignal<string>("No title");
const [getDesc, setDesc] = createSignal<string>("No description");
const [getPopupVisibilityState, setPopupVisibilityState] = createSignal<boolean>(false);

const popupJsx = <Show when={getPopupVisibilityState()}>
    <div id="popup-c">
        <div id="popup">
            <h1>{getTitle()}</h1>
            <p>{getDesc()}</p>
            <div id="bottom">
                <button onclick={() => setPopupVisibilityState(false)}>Close</button>
            </div>
        </div>
    </div>
</Show>;

interface PopupOpts {
    title: string;
    desc: string;
}

export function initPopup() {
    render(() => popupJsx, $("#other"));
    showPopup({
        title: "Before continuing...",
        desc: "Mobile support is limited. Use a computer or laptop for the best experience. \n\n"
    +   "This calculator is made as a final project for my calculus class in senior year of high school. "
    +   "It may not be accurate and may have bugs/glitches. Graphing asymptotes or negative exponents "
    +   "may incorrectly graph vertical lines on asymptotes. "
    +   "You should double check the polynomial disk solver just in case there's an error. "
    +   "Huge or tiny numbers may "
    +   "cause the polynomial disk solver to give an incorrect answer"
    });
}

export function showPopup(o: PopupOpts) {
    setTitle(o.title);
    setDesc(o.desc);
    setPopupVisibilityState(true);
}