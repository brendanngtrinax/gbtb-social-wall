<script lang="ts">
  import Card from "$lib/Card.svelte";
  import Longcard from "$lib/Longcard.svelte";
  import { fade } from "svelte/transition";

  let { numOfRows, numOfCols, numOfLongRows, shortCards, longCards } = $props();
</script>

<div
  class="grid grid-flow-col grid-rows-{numOfRows} gap-4 h-full place-items-center border"
>
  {#each { length: numOfCols } as _, j}
    {#each { length: numOfRows + numOfLongRows } as _, i}
      {#if i % 2 === 0}
        {@const f = Math.floor(i / 2)}
        {#if shortCards[f][j].status === "claimed"}
          <div
            class="row-span-1 short-card-{f}{j}"
            out:fade={{ duration: 500 }}
          >
            <Card
              name={shortCards[f][j].name}
              pledge={shortCards[f][j].pledge}
              avatarIndex={shortCards[f][j].avatarIndex}
              bgIndex={shortCards[f][j].backgroundIndex}
            />
          </div>
        {:else if shortCards[f][j].status === "free"}
          <div class="row-span-1 short-card-{f}{j} opacity-0">
            <Card
              name={shortCards[f][j].name}
              pledge={shortCards[f][j].pledge}
              avatarIndex={shortCards[f][j].avatarIndex}
              bgIndex={shortCards[f][j].backgroundIndex}
            />
          </div>
        {/if}
      {/if}
      {#if i % 2 === 1}
        {@const f = Math.floor(i / 2)}
        {#if longCards[f][j].status === "claimed"}
          <div class="row-span-2 long-card-{f}{j}" out:fade={{ duration: 500 }}>
            <Longcard
              name={longCards[f][j].name}
              pledge={longCards[f][j].pledge}
              avatarIndex={longCards[f][j].avatarIndex}
              bgIndex={longCards[f][j].backgroundIndex}
            />
          </div>
        {/if}
      {/if}
    {/each}
  {/each}
</div>
