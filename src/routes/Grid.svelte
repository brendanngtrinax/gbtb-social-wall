<script lang="ts">
  import Card from "$lib/Card.svelte";
  import Longcard from "$lib/Longcard.svelte";
  import { fade } from "svelte/transition";
  import {
    shortPositions,
    longPositions,
    cardWidth,
    shortCardHeight,
    longCardHeight,
    shortCards,
    longCards,
  } from "$lib/stores";

  /**
   * shortPositions: 2D array of [x, y] coordinates of short cards
   * longPositions: 2D array of [x, y] coordinates of long cards
   * shortCards: 2D array of short cards to hold the content to be displayed
   * longCards: 2D array of long cards to hold the content to be displayed
   */
  //   let {
  //     shortPositions,
  //     longPositions,
  //     cardWidth,
  //     shortCardHeight,
  //     longCardHeight,
  //     shortCards,
  //     longCards,
  //   } = $props();
</script>

<div id="absolute-grid" class="border h-[60%] relative">
  {#each $shortPositions as row, i}
    {#each row as shortPos, j}
      {#if $shortCards[i][j]}
        {@const x = shortPos[0]}
        {@const y = shortPos[1]}
        <div
          id="short-card-{i}-{j}"
          class="absolute flex items-center justify-center"
          style="left: {x}px; top: {y}px; width: {$cardWidth}px; height: {$shortCardHeight}px"
          out:fade={{ duration: 500 }}
        >
          <Card
            name={$shortCards[i][j].name}
            pledge={$shortCards[i][j].pledge}
            avatarIndex={$shortCards[i][j].avatarIndex}
            backgroundIndex={$shortCards[i][j].backgroundIndex}
          />
        </div>
      {/if}
    {/each}
  {/each}
  {#each $longPositions as row, i}
    {#each row as longPos, j}
      {@const x = longPos[0]}
      {@const y = longPos[1]}
      {#if $longCards[i][j]}
        <div
          id="long-card-{i}-{j}"
          class="absolute flex items-center justify-center"
          style="left: {x}px; top: {y}px; width: {$cardWidth}px; height: {$longCardHeight}px"
          out:fade={{ duration: 500 }}
        >
          <Longcard
            name={$longCards[i][j].name}
            pledge={$longCards[i][j].pledge}
            avatarIndex={$longCards[i][j].avatarIndex}
            backgroundIndex={$longCards[i][j].backgroundIndex}
          />
        </div>
      {/if}
    {/each}
  {/each}
</div>
