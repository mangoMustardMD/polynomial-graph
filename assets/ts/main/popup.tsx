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
        title: "Warning!",
        desc: "This calculator is made as a final project. "
    +   "It may not be accurate and may have bugs/glitches. "
    +   "Use at your own risk! 67"
    });
}

export function showPopup(o: PopupOpts) {
    setTitle(o.title);
    setDesc(o.desc);
    setPopupVisibilityState(true);
}