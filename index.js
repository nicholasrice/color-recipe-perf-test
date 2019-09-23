import * as styleExports from "@microsoft/fast-components-styles-msft";
import { memoize, noop } from "lodash-es";
const style = document.createElement("style");
style.innerHTML = "body { font-size: 20px; font-family: monospace; }";

document.head.appendChild(style);
const recipeNames = [
    "neutralForegroundRest",
    "neutralForegroundHover",
    "neutralForegroundActive",
    "accentForegroundCut",
    "accentForegroundCutLarge",
    "neutralForegroundHint",
    "neutralForegroundHintLarge",
    "accentForegroundRest",
    "accentForegroundHover",
    "accentForegroundActive",
    "accentForegroundLargeRest",
    "accentForegroundLargeHover",
    "accentForegroundLargeActive",
    "neutralFillRest",
    "neutralFillHover",
    "neutralFillActive",
    "neutralFillSelected",
    "neutralFillStealthRest",
    "neutralFillStealthHover",
    "neutralFillStealthActive",
    "neutralFillStealthSelected",
    "neutralFillInputRest",
    "neutralFillInputHover",
    "neutralFillInputActive",
    "neutralFillInputSelected",
    "accentFillRest",
    "accentFillHover",
    "accentFillActive",
    "accentFillSelected",
    "accentFillLargeRest",
    "accentFillLargeHover",
    "accentFillLargeActive",
    "accentFillLargeSelected",
    "neutralFillCard",
    "neutralOutlineRest",
    "neutralOutlineHover",
    "neutralOutlineActive",
    "neutralDividerRest",
    "neutralLayerFloating",
    "neutralLayerCard",
    "neutralLayerCardContainer",
    "neutralLayerL1",
    "neutralLayerL2",
    "neutralLayerL3",
    "neutralLayerL4"
];
const designSystem = styleExports.DesignSystemDefaults;
const designSystems = designSystem.neutralPalette.map(color =>
    Object.assign({}, designSystem, { backgroundColor: color })
);

const itterations = 20;
let results = [];
const scaleFactor = 1000000000000000000;
recipeNames.forEach(name => (results[name] = []));

for (var i = 0; i < itterations; i++) {
    recipeNames.forEach(recipeName => {
        designSystems.forEach(designSystem => {
            const recipe = styleExports[recipeName];

            performance.mark("recipe-start");
            recipe(designSystem);
            performance.measure("recipeDuration", "recipe-start");

            const measure = performance.getEntriesByType("measure");
            const duration = measure[0].duration;

            results[recipeName].push(duration * scaleFactor);

            performance.clearMarks();
            performance.clearMeasures();
        });
    });
}

const sortedSet = []
recipeNames.forEach(recipeName => {
    const timings = results[recipeName];
    const sorted = timings.sort((a, b) => b - a);
    const average = timings.reduce((accum, value) => accum + value) / timings.length
    const longest = sorted[0];

    sortedSet.push({recipeName, longest: longest / scaleFactor, average: average / scaleFactor});
});

console.log(sortedSet)
sortedSet.sort((a, b) => {
    return b.longest - a.longest;
});

const el = document.createElement("table");
const header = document.createElement("tr");
const nameHeading = document.createElement("th");
nameHeading.innerHTML = "Recipe name";
const meanHeading = document.createElement("th");
meanHeading.innerHTML = "Average duration";
const longestHeading = document.createElement("th");
longestHeading.innerHTML = "Longest duration";

header.appendChild(nameHeading);
header.appendChild(longestHeading);
header.appendChild(meanHeading);

el.appendChild(header);

sortedSet.forEach((result) => {
    const row = document.createElement("tr");
    const name = document.createElement("td")
    const longest = document.createElement("td")
    const mean = document.createElement("td")

    name.innerHTML = result.recipeName;
    longest.innerHTML = result.longest;
    mean.innerHTML = result.average;

    row.appendChild(name);
    row.appendChild(longest);
    row.appendChild(mean);

    el.appendChild(row);
})

document.body.appendChild(el);
