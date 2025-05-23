<script lang="ts">
  import type { ShortCardType, LongCardType } from "$lib/types";
  import { sampleShortCards } from "$lib/shared";
  import { onMount } from "svelte";
  import Grid from "./Grid.svelte";
  import Card from "$lib/Card.svelte";
  import LongCard from "$lib/Longcard.svelte";
  import {
    birdX,
    birdY,
    targetX,
    targetY,
    birdSpeed,
    animationFrameId,
    currentTargetPromiseResolve,
    birdShortCard,
    birdLongCard,
  } from "$lib/stores";

  import { numOfRows, numOfColumns, ratio, numOfLongRows } from "$lib/stores";

  import { shortQueue, shortCards, longCards } from "$lib/stores";

  import { updateBirdPosition, flyToTarget } from "$lib/birdlogic";
  import { determinePositions } from "$lib/gridpositionlogic";
  import {
    checkLongOverlap,
    checkShortOverlap,
    handleLongClaim,
    handleLongRelease,
    handleShortClaim,
    handleShortRelease,
    populateQueue,
  } from "$lib/gridlogic";

  async function loop() {
    // mergeServiceRoutine();
    let nextCard: ShortCardType | LongCardType | undefined = $shortQueue.at(0);
    let placed = false;
    if (!nextCard) {
      return;
    }
    // look for empty space
    if (nextCard.type === "short") {
      for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfColumns; j++) {
          if (!$shortCards[i][j]) {
            // check if the longcards got any overlaps
            if (await checkShortOverlap(i, j)) continue;
            // await flyToTarget(i, j, "short");
            await handleShortClaim(i, j, nextCard);

            setTimeout(async () => {
              await handleShortRelease(i, j);
            }, 10000);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    } else {
      // loop through longcards grid to find if any longcard.status === "free"
      for (let i = 0; i < numOfLongRows; i++) {
        for (let j = 0; j < numOfColumns; j++) {
          if (!$longCards[i][j]) {
            if (await checkLongOverlap(i, j)) continue;
            // await flyToTarget(i, j, "long");
            await handleLongClaim(i, j, nextCard);
            setTimeout(async () => {
              await handleLongRelease(i, j);
            }, 10000);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }

    if (placed) {
      shortQueue.update((q) => {
        q.shift();
        return q;
      });
    }
  }

  $inspect($shortCards, $longCards, $shortQueue);
  onMount(async () => {
    await populateQueue();
    setInterval(() => {
      loop();
    }, 1000);
    // setInterval(() => {
    //   getServerData();
    // }, 10000);
    await determinePositions();
    $animationFrameId = requestAnimationFrame(updateBirdPosition);
  });
</script>

<main class="relative h-screen p-10">
  <!-- <div
    class="absolute z-15"
    style="transition: none;
         left: {$birdX - 160}px;
         top: {$birdY - 160}px;"
  >
    <div class="relative w-80 h-80 z-15">
      <img
        src="/birdflying.gif"
        alt="bird"
        class="absolute top-0 left-0 z-10 w-80 h-80"
      />
      {#if $birdShortCard}
        <div id="bird-short-card" class="absolute z-0 top-40 left-40">
          <Card
            name={$birdShortCard.name}
            pledge={$birdShortCard.pledge}
            avatarIndex={$birdShortCard.avatarIndex}
            backgroundIndex={$birdShortCard.backgroundIndex}
          />
        </div>
      {/if}
    </div>
  </div> -->

  <Grid />
</main>

<!-- 
Few things to try:
1) mark the absolute positions of each card and then get the bird and card to move to that position 
2) use js to calculate whether any existing position is free first
3) use a timer system to remove old cards, they just fade out
4) maybe each card can have random timers


Maybe keep a queue. every 10 seconds, poll the server for new cards and add to queue
-->
