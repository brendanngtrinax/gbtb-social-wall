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

  function fadeOut(element: HTMLDivElement) {
    element.classList.add("opacity-0");
  }

  function switchSmalltoLong(
    smallElement1: HTMLDivElement,
    smallElement2: HTMLDivElement,
    longElement: HTMLDivElement,
  ) {
    smallElement1.classList.add("hidden");
    smallElement2.classList.add("hidden");
    longElement.classList.remove("hidden");
  }

  function switchLongtoSmall(
    smallElement1: HTMLDivElement,
    smallElement2: HTMLDivElement,
    longElement: HTMLDivElement,
  ) {
    longElement.classList.add("hidden");
    smallElement1.classList.remove("hidden");
    smallElement2.classList.remove("hidden");
  }

  function getPosXandY(element: HTMLDivElement) {
    let posX = element.getBoundingClientRect().x;
    let posY = element.getBoundingClientRect().y;
    return { posX, posY };
  }

  function swapSmallToSmall() {}

  async function poll() {
    return [];
  }

  function handleShortClaim(i: number, j: number) {
    shortCards[i][j].status = "claimed";
    shortCards = shortCards;
    for (let k = 0; k < ratio; k++) {
      let index = i - k;
      if (index < 0 || index >= numOfLongRows) {
        continue;
      } else {
        longCards[index][j].status = "claimed";
      }
    }
  }

  function handleShortRelease(i: number, j: number) {
    shortCards[i][j].status = "free";

    for (let k = 0; k < ratio; k++) {
      let start = i - k;
      if (start < 0 || start + ratio > numOfRows) continue;

      // Check if all shortCards from start to start + ratio are "free"
      let allFree = true;
      for (let offset = 0; offset < ratio; offset++) {
        if (shortCards[start + offset][j].status !== "free") {
          allFree = false;
          break;
        }
      }

      if (allFree) {
        longCards[start][j].status = "free";
      }
    }
  }

  function delayedRemove(i: number, j: number) {
    setTimeout(
      () => {
        // check if queue is non-empty, only remove if queue is non-empty else recursive loop
        if (queue.length > 0) {
          let element = getSmallCardElement(i, j);
          element.classList.remove("opacity-100");
          element.classList.add("opacity-0");
          handleShortRelease(i, j);
        } else {
          delayedRemove(i, j);
        }
      },
      Math.floor(Math.random() * 2000) + 20000,
    );
  }

  async function getServerData() {
    queue = queue.concat(await poll());
  }

  function loop() {
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
            let element = getSmallCardElement(i, j);
            let { posX, posY } = getPosXandY(element);
            element.classList.add("opacity-100");
            delayedRemove(i, j);
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
    }

    // no space then place the card back in queue
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
