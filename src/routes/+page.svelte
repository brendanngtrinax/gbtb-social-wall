<script lang="ts">
  import type { ShortCard, LongCard } from "$lib/types";
  import { sampleShortCards } from "$lib/shared";
  import Card from "$lib/Card.svelte";
  import Longcard from "$lib/Longcard.svelte";
  import { onMount, tick } from "svelte";
  import Grid from "./Grid.svelte";
  import { fade } from "svelte/transition";

  // Helper function to create a basic ShortCard (adjust properties as needed)
  function createShortCard(index: number): ShortCard {
    return {
      type: "short",
      status: "free",
      name: `Short Card ${index}`,
      pledge: `Short Pledge ${index}`,
      avatarIndex: 0,
      backgroundIndex: 0,
    };
  }

  // Helper function to create a basic LongCard (adjust properties as needed)
  function createLongCard(index: number): LongCard {
    return {
      type: "long",
      status: "free",
      name: `Long Card ${index}`,
      pledge: `Long Pledge ${index}`,
      avatarIndex: 0,
      backgroundIndex: 0,
    };
  }

  let numOfRows = 3;
  let numOfCols = 3;
  let ratio = 2; // ratio of length of long cards to short cards
  let numOfLongRows = numOfRows - ratio + 1; // using CNN output size formula
  let shortCards: ShortCard[][] = Array.from({ length: numOfRows }, (_, i) =>
    Array.from({ length: numOfCols }, (_, j) => ({
      type: "short",
      status: "free",
      name: `Placeholder ${i},${j}`,
      pledge: `Pledge ${i * numOfCols + j + 1}`,
      avatarIndex: 0,
      backgroundIndex: 0,
    })),
  );

  let longCards: LongCard[][] = Array.from({ length: numOfLongRows }, (_, i) =>
    Array.from({ length: numOfCols }, (_, j) => ({
      type: "long",
      status: "free",
      name: `Placeholder ${i},${j}`,
      pledge: `Pledge ${i * numOfCols + j + 1}`,
      avatarIndex: 0,
      backgroundIndex: 0,
    })),
  );

  let queue: (ShortCard | LongCard)[] = [];
  let cardCounter = 0; // To give unique names/pledges

  // just for testing and populating stack
  for (let i = 0; i < 12; i++) {
    queue.push(createShortCard(cardCounter++));
  }
  queue.push(createLongCard(cardCounter++));
  for (let i = 0; i < 3; i++) {
    queue.push(createShortCard(cardCounter++));
  }
  for (let i = 0; i < 2; i++) {
    queue.push(createLongCard(cardCounter++));
  }

  function getSmallCardElement(i: number, j: number) {
    return document.querySelector(`.short-card-${i}${j}`) as HTMLDivElement;
  }

  function getLongCardElement(i: number, j: number) {
    return document.querySelector(`.long-card-${i}${j}`) as HTMLDivElement;
  }

  function getPosXandY(element: HTMLDivElement) {
    let posX = element.getBoundingClientRect().x;
    let posY = element.getBoundingClientRect().y;
    return { posX, posY };
  }

  async function poll() {
    return [];
  }

  function handleShortClaim(i: number, j: number) {
    shortCards[i][j].status = "claimed";

    for (let k = 0; k < ratio; k++) {
      let index = i - k;
      if (index < 0 || index >= numOfLongRows) {
        continue;
      } else {
        longCards[index][j].status = "hidden";
      }
    }
    shortCards = shortCards;
    longCards = longCards;
  }

  function mergeServiceRoutine() {
    // Iterate through all long cards
    for (let i = 0; i < numOfLongRows; i++) {
      for (let j = 0; j < numOfCols; j++) {
        // If a long card is not already free, check if it can be freed
        if (longCards[i][j].status === "hidden") {
          let canBeFreed = true;
          // Check the status of the short cards that this long card overlaps
          for (let k = 0; k < ratio; k++) {
            let shortCardIndex = i + k;
            if (shortCardIndex < 0 || shortCardIndex >= numOfRows) {
              // This should not happen, but defensive programming is good.
              continue;
            }
            if (shortCards[shortCardIndex][j].status !== "free") {
              canBeFreed = false;
              break; // No need to check further short cards
            }
          }
          // If all overlapping short cards are free, free the long card
          if (canBeFreed) {
            longCards[i][j].status = "transition";
            setTimeout(() => {
              longCards[i][j].status = "free";
            }, 500);
          }
        }
      }
    }
    longCards = longCards;
  }

  function handleShortRelease(i: number, j: number) {
    shortCards[i][j].status = "transition";
    setTimeout(() => {
      shortCards[i][j].status = "free";
    }, 500);
    shortCards = shortCards;
  }

  function delayedShortRemove(i: number, j: number) {
    setTimeout(
      () => {
        // check if queue is non-empty, only remove if queue is non-empty else recursive loop
        if (queue.length > 0) {
          handleShortRelease(i, j);
        } else {
          delayedShortRemove(i, j);
        }
      },
      // Math.floor(Math.random() * 2000) + 20000,
      10000,
    );
  }

  function handleLongClaim(i: number, j: number) {
    longCards[i][j].status = "claimed";

    for (let k = 0; k < ratio; k++) {
      let index = i + k;
      if (index < 0 || index >= numOfRows) {
        continue;
      } else {
        shortCards[index][j].status = "hidden";
      }
    }
    longCards = longCards;
    shortCards = shortCards;
  }

  function handleLongRelease(i: number, j: number) {
    longCards[i][j].status = "transition";
    setTimeout(() => {
      longCards[i][j].status = "free";
    }, 500);

    for (let k = 0; k < ratio; k++) {
      let start = i + k;
      if (start < 0 || start + ratio > numOfRows) continue;
      shortCards[start][j].status = "transition";
      setTimeout(() => {
        shortCards[start][j].status = "free";
      }, 500);
    }
    longCards = longCards;
    shortCards = shortCards;
  }

  function delayedLongRemove(i: number, j: number) {
    setTimeout(
      () => {
        // check if queue is non-empty, only remove if queue is non-empty else recursive loop
        if (queue.length > 0) {
          handleLongRelease(i, j);
        } else {
          delayedLongRemove(i, j);
        }
      },
      // Math.floor(Math.random() * 2000) + 20000,
      10000,
    );
  }

  async function getServerData() {
    queue = queue.concat(await poll());
    console.log("shortCards: ", shortCards);
    console.log("longCards: ", longCards);
    console.log("Queue: ", queue);
  }

  function loop() {
    mergeServiceRoutine();
    let nextCard: ShortCard | LongCard | undefined = queue.shift();

    if (!nextCard) {
      return;
    }
    // look for empty space
    if (nextCard.type === "short") {
      // loop through shortcards grid to find if any shortcard.status === "free"
      let placed = false;
      for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
          if (shortCards[i][j].status === "free") {
            shortCards[i][j] = nextCard;
            handleShortClaim(i, j);
            // let element = getSmallCardElement(i, j);
            // let { posX, posY } = getPosXandY(element);
            delayedShortRemove(i, j);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
      if (!placed) {
        queue.unshift(nextCard);
      }
    } else {
      // loop through longcards grid to find if any longcard.status === "free"
      let placed = false;
      for (let i = 0; i < numOfLongRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
          if (longCards[i][j].status === "free") {
            longCards[i][j] = nextCard;
            handleLongClaim(i, j);
            // let element = getLongCardElement(i, j);
            // let { posX, posY } = getPosXandY(element);
            // element.classList.add("opacity-100");
            delayedLongRemove(i, j);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
      if (!placed) {
        queue.unshift(nextCard);
      }
    }
  }

  onMount(() => {
    setInterval(() => {
      loop();
    }, 1000);
    setInterval(() => {
      getServerData();
    }, 10000);
  });
</script>

<main class="relative h-screen p-10">
  <Grid {numOfRows} {numOfCols} {numOfLongRows} {shortCards} {longCards} />
</main>

<!-- 
Few things to try:
1) mark the absolute positions of each card and then get the bird and card to move to that position 
2) use js to calculate whether any existing position is free first
3) use a timer system to remove old cards, they just fade out
4) maybe each card can have random timers


Maybe keep a queue. every 10 seconds, poll the server for new cards and add to queue
-->

<style>
  @keyframes fly {
    0% {
      left: -20%;
      top: -20%;
    }
    100% {
      left: var(--posX);
      top: var(--posY);
    }
  }

  .animate-fly {
    animation: fly 2s linear infinite;
  }
</style>
