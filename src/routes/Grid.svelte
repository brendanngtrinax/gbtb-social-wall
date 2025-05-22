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
    {#each { length: numOfRows } as _, i}
      {#if shortCards[i][j].status === "claimed"}
        <div class="row-span-1 short-card-{i}{j}" out:fade={{ duration: 500 }}>
          <Card
            name={shortCards[i][j].name}
            pledge={shortCards[i][j].pledge}
            avatarIndex={shortCards[i][j].avatarIndex}
            bgIndex={shortCards[i][j].backgroundIndex}
          />
        </div>
      {:else if shortCards[i][j].status === "free"}
        <div class="row-span-1 short-card-{i}{j} opacity-30">
          <Card
            name={shortCards[i][j].name}
            pledge={shortCards[i][j].pledge}
            avatarIndex={shortCards[i][j].avatarIndex}
            bgIndex={shortCards[i][j].backgroundIndex}
          />
        </div>
      {/if}
    {/each}
    {#each { length: numOfLongRows } as _, i}
      {#if longCards[i][j].status === "claimed"}
        <div class="row-span-2 long-card-{i}{j}" out:fade={{ duration: 500 }}>
          <Longcard
            name={longCards[i][j].name}
            pledge={longCards[i][j].pledge}
            avatarIndex={longCards[i][j].avatarIndex}
            bgIndex={longCards[i][j].backgroundIndex}
          />
        </div>
      {/if}
    {/each}
  {/each}
</div>
