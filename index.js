import { memoize, noop } from "lodash-es";
import * as styleExports from "@microsoft/fast-components-styles-msft";
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
const DesignSystemDefaults = styleExports.DesignSystemDefaults;
const layers = [
    "neutralLayerFloating",
    "neutralLayerCard",
    "neutralLayerCardContainer",
    "neutralLayerL1",
    "neutralLayerL2",
    "neutralLayerL3",
    "neutralLayerL4"
];

const darkModeDesignSystem = Object.assign({}, DesignSystemDefaults, { backgroundColor: "#000000" });
const lightModeDesignSystem = DesignSystemDefaults;

const darkModeDesignSystems = layers.map(name => Object.assign({}, DesignSystemDefaults, { backgroundColor: styleExports[name](darkModeDesignSystem) }));
const lightModeDesignSystems = layers.map(name => Object.assign({}, DesignSystemDefaults, { backgroundColor: styleExports[name](lightModeDesignSystem) }));

const designSystems = lightModeDesignSystems.concat(darkModeDesignSystems);

const itterations = 1;
let results = [];
const scaleFactor = 1000000000000000000;
let totalDuration = 0;
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
            totalDuration += duration;
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

    sortedSet.push({recipeName, longest: (longest / scaleFactor).toFixed(3), average: (average / scaleFactor).toFixed(2)});
});

sortedSet.sort((a, b) => {
    return b.longest - a.longest;
});

const el = document.createElement("table");
const caption  = document.createElement("caption");
caption.innerHTML = `Total execution time: ${totalDuration}`;
el.appendChild(caption);

const header = document.createElement("thead");
const headerRow = document.createElement("tr");
header.appendChild(headerRow);
const nameHeading = document.createElement("th");

nameHeading.innerHTML = "Recipe name";
const meanHeading = document.createElement("th");
meanHeading.innerHTML = "Average duration";
const longestHeading = document.createElement("th");
longestHeading.innerHTML = "Longest duration";

headerRow.appendChild(nameHeading);
headerRow.appendChild(longestHeading);
headerRow.appendChild(meanHeading);

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
