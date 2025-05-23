import { get } from "svelte/store";
import { numOfRows, numOfColumns, ratio, numOfLongRows } from "$lib/stores";
import { cardWidth, shortCardHeight, longCardHeight } from "$lib/stores";
import { shortPositions, longPositions } from "$lib/stores";

export async function determinePositions() {
  let totalWidth = document.getElementById("absolute-grid")!.clientWidth;
  let totalHeight = document.getElementById("absolute-grid")!.clientHeight;
  cardWidth.set(totalWidth / numOfColumns);
  shortCardHeight.set(totalHeight / numOfRows);
  longCardHeight.set(get(shortCardHeight) * ratio);
  shortPositions.set(
    Array.from({ length: numOfRows }, (_, i) =>
      Array.from({ length: numOfColumns }, (_, j) => [
        j * get(cardWidth),
        i * get(shortCardHeight),
      ]),
    ),
  );
  longPositions.set(
    Array.from({ length: numOfLongRows }, (_, i) =>
      Array.from({ length: numOfColumns }, (_, j) => [
        j * get(cardWidth),
        i * get(shortCardHeight),
      ]),
    ),
  );
}
