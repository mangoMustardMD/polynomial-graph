import { JSX } from "solid-js/jsx-runtime";

export function NumInput(props: {
    value: number;
    max?: number;
    placeholder: string;
    onInput: (n: number) => void;
    step: string;
}): JSX.Element {
    return <input
        value={props.value}
        type="number"
        required
        placeholder={props.placeholder}
        max={props.max}
        step={props.step}
        oninput={e => {
            const { validity } = e.currentTarget;
            if (!validity.valid) e.currentTarget.classList.add("invalid");
            else {
                e.currentTarget.classList.remove("invalid");
                const val = e.currentTarget.valueAsNumber;
                if (Number.isNaN(val))
                    e.currentTarget.classList.add("invalid");
                else {
                    // if valid
                    props.onInput(val);
                }
            }
        } } />;
}
