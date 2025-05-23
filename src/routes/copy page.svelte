<!-- <script lang="ts">
  import type { ShortCardType, LongCard } from "$lib/types";
  import { sampleShortCards } from "$lib/shared";
  import { onMount } from "svelte";
  import Grid from "./Grid.svelte";
  import Card from "$lib/Card.svelte";

  // Helper function to create a basic ShortCard (adjust properties as needed)
  function createShortCard(index: number): ShortCardType {
    return {
      type: "short",
      status: "free",
      name: `Short Card ${index}`,
      pledge: `Short Pledge ${index}`,
      avatarIndex: 1,
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
      backgroundIndex: 1,
    };
  }

  let birdX = $state(1000);
  let birdY = $state(1000);
  let targetX = $state(birdX);
  let targetY = $state(birdY);
  let birdSpeed = 5;
  let animationFrameId: number;
  let currentTargetPromiseResolve: (() => void) | null = null;
  let birdShortCard: ShortCardType = $state({
    type: "short",
    status: "free",
    name: "Bird",
    pledge: "Bird Pledge",
    avatarIndex: 0,
    backgroundIndex: 0,
  });

  const numOfRows = 3;
  const numOfCols = 3;
  const ratio = 2; // ratio of length of long cards to short cards
  const numOfLongRows = numOfRows - ratio + 1; // using CNN output size formula
  let shortCards: ShortCardType[][] = $state(
    Array.from({ length: numOfRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => ({
        type: "short",
        status: "free",
        name: `Placeholder ${i},${j}`,
        pledge: `Pledge ${i * numOfCols + j + 1}`,
        avatarIndex: 0,
        backgroundIndex: 0,
      })),
    ),
  );

  let longCards: LongCard[][] = $state(
    Array.from({ length: numOfLongRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => ({
        type: "long",
        status: "free",
        name: `Placeholder ${i},${j}`,
        pledge: `Pledge ${i * numOfCols + j + 1}`,
        avatarIndex: 0,
        backgroundIndex: 0,
      })),
    ),
  );

  let shortPositions: number[][][] = $state(
    Array.from({ length: numOfRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => [i * 100, j * 200]),
    ),
  );

  let longPositions: number[][][] = $state(
    Array.from({ length: numOfLongRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => [i * 100, j * 200]),
    ),
  );

  let queue: (ShortCardType | LongCard)[] = [];
  let cardCounter = 0; // To give unique names/pledges

  // just for testing and populating stack
  // queue.push(createShortCard(cardCounter++));
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

  function getShortCardElement(i: number, j: number) {
    return document.getElementById(`short-card-${i}-${j}`) as HTMLDivElement;
  }

  function getLongCardElement(i: number, j: number) {
    return document.getElementById(`long-card-${i}-${j}`) as HTMLDivElement;
  }

  async function poll() {
    return [];
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
            longCards[i][j].status = "free";
          }
        }
      }
    }
    longCards = longCards;
  }

  function handleShortClaim(i: number, j: number) {
    shortCards[i][j].status = "claimed";
    let shortCardElement = getShortCardElement(i, j);
    shortCardElement.classList.add("opacity-100");
    shortCardElement.classList.remove("opacity-0", "transition-opacity");

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

  function handleShortRelease(i: number, j: number) {
    shortCards[i][j].status = "transition";
    let shortCardElement = getShortCardElement(i, j);
    shortCardElement.classList.remove("opacity-100");
    shortCardElement.classList.add("opacity-0", "transition-opacity");
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
    let longCardElement = getLongCardElement(i, j);
    longCardElement.classList.add("opacity-100");
    longCardElement.classList.remove("opacity-0", "transition-opacity");

    for (let k = 0; k < ratio; k++) {
      let index = i + k;
      if (index < 0 || index >= numOfRows) {
        continue;
      } else {
        shortCards[index][j].status = "hidden";
      }
    }

    for (
      let otherLongCardRow = 0;
      otherLongCardRow < numOfLongRows;
      otherLongCardRow++
    ) {
      if (otherLongCardRow === i) continue; // Skip the current long card

      const currentLongCardStartRow = i;
      const currentLongCardEndRow = i + ratio - 1;
      const otherLongCardStartRow = otherLongCardRow;
      const otherLongCardEndRow = otherLongCardRow + ratio - 1;

      // Check for overlap:
      if (
        currentLongCardStartRow <= otherLongCardEndRow &&
        currentLongCardEndRow >= otherLongCardStartRow &&
        longCards[otherLongCardRow][j].status !== "free"
      ) {
        longCards[otherLongCardRow][j].status = "hidden";
      }
    }

    longCards = longCards;
    shortCards = shortCards;
  }

  function handleLongRelease(i: number, j: number) {
    longCards[i][j].status = "transition";
    let longCardElement = getLongCardElement(i, j);
    longCardElement.classList.remove("opacity-100");
    longCardElement.classList.add("opacity-0", "transition-opacity");
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
    // console.log("time:" + new Date().toLocaleTimeString());
  }

  function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function updateBirdPosition() {
    const distance = calculateDistance(birdX, birdY, targetX, targetY);

    if (distance > birdSpeed) {
      // Move towards target
      const dx = targetX - birdX;
      const dy = targetY - birdY;

      const directionX = dx / distance;
      const directionY = dy / distance;

      birdX += directionX * birdSpeed;
      birdY += directionY * birdSpeed;
    } else {
      // Snap to target if very close to avoid overshooting/oscillation
      birdX = targetX;
      birdY = targetY;

      if (currentTargetPromiseResolve) {
        currentTargetPromiseResolve();
        currentTargetPromiseResolve = null; // Clear it
      }
      // Optionally, stop the animation here if the bird should only move once
      // cancelAnimationFrame(animationFrameId);
    }

    // Continue animation loop
    animationFrameId = requestAnimationFrame(updateBirdPosition);
  }

  function flyToTarget(x: number, y: number): Promise<void> {
    return new Promise((resolve) => {
      // Set the new target
      targetX = x;
      targetY = y;

      // Store the resolve function of this promise
      currentTargetPromiseResolve = resolve;

      // Ensure the animation loop is running
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateBirdPosition);
      }
    });
  }

  async function loop() {
    mergeServiceRoutine();
    let nextCard: ShortCardType | LongCard | undefined = queue.shift();

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
            birdShortCard = nextCard;
            let element = getShortCardElement(i, j).firstElementChild;
            let posX = element?.getBoundingClientRect().x!;
            let posY = element?.getBoundingClientRect().y!;
            await flyToTarget(posX, posY);
            handleShortClaim(i, j);
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // await flyToTarget(1000, 1000);

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

  let cardWidth: number = $state(0);
  let shortCardHeight: number = $state(0);
  let longCardHeight: number = $state(0);

  onMount(() => {
    setInterval(() => {
      loop();
    }, 1000);
    setInterval(() => {
      getServerData();
    }, 10000);
    let totalWidth = document.getElementById("absolute-grid")!.clientWidth;
    let totalHeight = document.getElementById("absolute-grid")!.clientHeight;
    cardWidth = totalWidth / numOfCols;
    shortCardHeight = totalHeight / numOfRows;
    longCardHeight = shortCardHeight * ratio;
    shortPositions = Array.from({ length: numOfRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => [
        Math.floor(j * cardWidth),
        Math.floor(i * shortCardHeight),
      ]),
    );

    longPositions = Array.from({ length: numOfLongRows }, (_, i) =>
      Array.from({ length: numOfCols }, (_, j) => [
        Math.floor(j * cardWidth),
        Math.floor(i * shortCardHeight),
      ]),
    );
    animationFrameId = requestAnimationFrame(updateBirdPosition);
  });
</script>

<main class="relative h-screen p-10">
  <div
    class="absolute z-15"
    style="transition: none;
         left: {birdX - 160}px;
         top: {birdY - 160}px;"
  >
    <div class="relative w-80 h-80 z-15">
      <img
        src="/birdflying.gif"
        alt="bird"
        class="absolute top-0 left-0 z-10 w-80 h-80"
      />
      <div id="bird-short-card" class="absolute z-0 top-40 left-40">
        <Card
          name={birdShortCard.name}
          pledge={birdShortCard.pledge}
          avatarIndex={birdShortCard.avatarIndex}
          backgroundIndex={birdShortCard.backgroundIndex}
        />
      </div>
    </div>
  </div>

  <Grid
    {shortPositions}
    {longPositions}
    cardWidth={Math.floor(cardWidth)}
    shortCardHeight={Math.floor(shortCardHeight)}
    longCardHeight={Math.floor(longCardHeight)}
    {shortCards}
    {longCards}
  />
</main>

<!-- 
Few things to try:
1) mark the absolute positions of each card and then get the bird and card to move to that position 
2) use js to calculate whether any existing position is free first
3) use a timer system to remove old cards, they just fade out
4) maybe each card can have random timers


Maybe keep a queue. every 10 seconds, poll the server for new cards and add to queue
-->
-->
