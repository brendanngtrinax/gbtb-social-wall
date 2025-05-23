import { writable } from "svelte/store";
import type { ShortCardType, LongCardType } from "$lib/types";

const initialBirdX = 1000;
const initialBirdY = 1000;
const initialBirdSpeed = 5;

export let birdX = writable(initialBirdX);
export let birdY = writable(initialBirdY);
export let targetX = writable(initialBirdX);
export let targetY = writable(initialBirdY);
export let birdSpeed = writable(initialBirdSpeed);
export let animationFrameId = writable(0);
export let currentTargetPromiseResolve = writable<(() => void) | null>(
  () => () => {},
);
export let birdShortCard = writable<ShortCardType | null>(null);
export let birdLongCard = writable<LongCardType | null>(null);

export const numOfRows = 2;
export const numOfColumns = 3;
export const ratio = 2;
export const numOfLongRows = numOfRows - ratio + 1;

export let shortQueue = writable<ShortCardType[]>([]);
export let longQueue = writable<LongCardType[]>([]);
export let shortCards = writable<(ShortCardType | null)[][]>(
  Array.from({ length: numOfRows }, () => Array(numOfColumns).fill(null)),
);
export let longCards = writable<(LongCardType | null)[][]>(
  Array.from({ length: numOfLongRows }, () => Array(numOfColumns).fill(null)),
);

export let cardWidth = writable(0);
export let shortCardHeight = writable(0);
export let longCardHeight = writable(0);

export let shortPositions = writable<number[][][]>(
  Array.from({ length: numOfRows }, () =>
    Array.from({ length: numOfColumns }, () => [0, 0]),
  ),
);
export let longPositions = writable<number[][][]>(
  Array.from({ length: numOfLongRows }, () =>
    Array.from({ length: numOfColumns }, () => [0, 0]),
  ),
);
