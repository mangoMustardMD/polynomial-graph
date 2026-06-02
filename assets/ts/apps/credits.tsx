import { For, JSX } from "solid-js";

const icon = <div class="app">
    <h2>Credits</h2>

</div>;

const dependList = {
    "less": "^4.6.4",
    "typescript": "^6.0.3",
    "vite": "^8.0.12",
    "vite-plugin-checker": "^0.13.0",
    "vite-plugin-solid": "^2.11.12",
    "pixi.js": "^8.18.1",
    "solid-js": "^1.9.12",
};

const page = <div class="intersections-page">
    <h1>Credits</h1>
    <p>Made by: MD</p>
    <p>This software is licensed under the Apache License 2.0</p>
    <br />
    <hr />
    <br />
    <p>Libraries used:</p>
    <ul>
        <For each={Object.entries(dependList)}>{([name, vR]) =>
            <li>{name} v{vR.slice(1, vR.length)}</li>
        }</For>
    </ul>
</div>;

export function initCreditsApp(): [JSX.Element, JSX.Element] {
    return [icon, page];
}