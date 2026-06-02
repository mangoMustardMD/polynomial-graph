import { JSX } from "solid-js/jsx-runtime";
import { initPolynomialApp } from "./polynomial";
import { initIntersectionsApp } from "./intersections";
import { initCreditsApp } from "./credits";

export const appList: Map<string, [JSX.Element, JSX.Element]> = new Map();

export function initAppList() {
    appList.set("polynomial", initPolynomialApp());
    appList.set("intersections", initIntersectionsApp());
    appList.set("credits", initCreditsApp());
}