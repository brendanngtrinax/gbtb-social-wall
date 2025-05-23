import { get } from "svelte/store";
import type { ShortCardType, LongCardType } from "$lib/types";
import { numOfRows, numOfColumns, ratio, numOfLongRows } from "$lib/stores";
import { shortQueue, shortCards, longCards } from "$lib/stores";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerData() {
  shortQueue.update((queue) => queue.concat([]));
}

export async function handleShortClaim(
  i: number,
  j: number,
  card: ShortCardType,
) {
  shortCards.update((cards) => {
    cards[i][j] = card;
    return cards;
  });
}

export async function handleShortRelease(i: number, j: number) {
  shortCards.update((cards) => {
    cards[i][j] = null;
    return cards;
  });
  // await sleep(500);
}

export async function handleLongClaim(
  i: number,
  j: number,
  card: LongCardType,
) {
  longCards.update((cards) => {
    cards[i][j] = card;
    return cards;
  });
}

export async function handleLongRelease(i: number, j: number) {
  longCards.update((cards) => {
    cards[i][j] = null;
    return cards;
  });
  // await sleep(500);
}

export async function checkShortOverlap(i: number, j: number) {
  for (let k = 0; k < ratio; k++) {
    let index = i - k;
    if (index < 0 || index >= numOfLongRows) {
      continue;
    }
    if (get(longCards)[index][j]) {
      return true;
    }
  }
  return false;
}

export async function checkLongOverlap(i: number, j: number) {
  for (let k = 0; k < ratio; k++) {
    let index = i + k;
    if (index < 0 || index >= numOfRows) {
      continue;
    }
    if (get(shortCards)[index][j]) {
      return true;
    }
  }

  for (let k = 0; k < numOfLongRows; k++) {
    if (k === i) continue; // Skip the current long card

    const currentLongCardStartRow = i;
    const currentLongCardEndRow = i + ratio - 1;
    const otherLongCardStartRow = k;
    const otherLongCardEndRow = k + ratio - 1;

    // Check for overlap:
    if (
      currentLongCardStartRow <= otherLongCardEndRow &&
      currentLongCardEndRow >= otherLongCardStartRow &&
      get(longCards)[k][j]
    ) {
      return true;
    }
  }
  return false;
}

// Helper function to create a basic ShortCard (adjust properties as needed)
function createShortCard(index: number): ShortCardType {
  return {
    type: "short",
    status: "free",
    name: `Short Card ${index}`,
    pledge: `Short Pledge ${index}`,
    avatarIndex: Math.floor(Math.random() * 6),
    backgroundIndex: Math.floor(Math.random() * 6),
  };
}

// Helper function to create a basic LongCard (adjust properties as needed)
function createLongCard(index: number): LongCardType {
  return {
    type: "long",
    status: "free",
    name: `Long Card ${index}`,
    pledge: `Long Pledge ${index}`,
    avatarIndex: Math.floor(Math.random() * 6),
    backgroundIndex: Math.floor(Math.random() * 6),
  };
}

export async function populateQueue() {
  let cardCount = 0;

  for (let i = 0; i < 12; i++) {
    shortQueue.update((q) => {
      q.push(createShortCard(cardCount++));
      return q;
    });
  }

  for (let i = 0; i < 2; i++) {
    shortQueue.update((q) => {
      q.push(createLongCard(cardCount++));
      return q;
    });
  }
}
