<script lang="ts">
  import Card from "$lib/Card.svelte";
  import Longcard from "$lib/Longcard.svelte";
  import { fade } from "svelte/transition";

  /**
   * shortPositions: 2D array of [x, y] coordinates of short cards
   * longPositions: 2D array of [x, y] coordinates of long cards
   * shortCards: 2D array of short cards to hold the content to be displayed
   * longCards: 2D array of long cards to hold the content to be displayed
   */
  let {
    shortPositions,
    longPositions,
    cardWidth,
    shortCardHeight,
    longCardHeight,
    shortCards,
    longCards,
  } = $props();
</script>

<div id="absolute-grid" class="border h-full relative">
  {#each shortPositions as row, i}
    {#each row as shortPos, j}
      {@const x = shortPos[0]}
      {@const y = shortPos[1]}
      <div
        id="short-card-{i}-{j}"
        class="absolute flex items-center justify-center opacity-0"
        style="left: {x}px; top: {y}px; width: {cardWidth}px; height: {shortCardHeight}px"
      >
        <Card
          name={shortCards[i][j].name}
          pledge={shortCards[i][j].pledge}
          avatarIndex={shortCards[i][j].avatarIndex}
          backgroundIndex={shortCards[i][j].backgroundIndex}
        />
      </div>
    {/each}
  {/each}
  {#each longPositions as row, i}
    {#each row as longPos, j}
      {@const x = longPos[0]}
      {@const y = longPos[1]}
      <div
        id="long-card-{i}-{j}"
        class="absolute flex items-center justify-center opacity-0"
        style="left: {x}px; top: {y}px; width: {cardWidth}px; height: {longCardHeight}px"
      >
        <Longcard
          name={longCards[i][j].name}
          pledge={longCards[i][j].pledge}
          avatarIndex={longCards[i][j].avatarIndex}
          backgroundIndex={longCards[i][j].backgroundIndex}
        />
      </div>
    {/each}
  {/each}
</div>
