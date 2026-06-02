import { For, render } from "solid-js/web";
import { mainDiv, c, appPrRes } from "../constants";
import { appList, initAppList } from "../apps/main";
import { createSignal, onMount, Show } from "solid-js";

export function addElements() {
    initAppList();

    render(() => {
        onMount(appPrRes);

        const showAppGridSignal = createSignal(true);

        const [getActive, setActive] = createSignal("");
        function onAppClick(name: string) {
            setActive(name);
            showAppGridSignal[1](false);
        }

        function onPageBackBtnClick() {
            setActive("");
            showAppGridSignal[1](true);
        }

        return <>
            <div id="cc">
                {c}
            </div>
            <Show when={showAppGridSignal[0]()}>
                <div id="apps">
                    <For each={Array.from(appList)}>{([name, [app, page]]) => 
                        <button class="app-c" onclick={() => onAppClick(name)}>
                            <p>{name}</p>
                            {app}
                        </button>
                    }</For>
                </div>
            </Show>
            <Show when={!showAppGridSignal[0]()}>
                <For each={Array.from(appList)}>{([name, [app, page]]) => 
                    <Show when={getActive() == name}>
                        <div class="page">
                            <button onclick={() => onPageBackBtnClick()}>Back</button>
                            {page}
                        </div>
                    </Show>
                }</For>
            </Show>
        </>
    }, mainDiv);
}