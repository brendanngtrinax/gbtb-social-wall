<script lang="ts">
  import Card from "$lib/Card.svelte";
  import Longcard from "$lib/Longcard.svelte";

  let { numOfRows, numOfCols, numOfLongRows, shortCards, longCards } = $props();
</script>

<div
  class="grid grid-flow-col gap-4 h-full place-items-center border"
  style="grid-template-columns: repeat({numOfCols}, minmax(0, 1fr)); grid-template-rows: repeat({Math.max(
    numOfRows,
    numOfLongRows,
  )}, minmax(0, 1fr));"
>
  {#each { length: numOfCols } as _, j}
    {#each { length: numOfRows } as _, i}
      <div class="short-card-{i}{j} opacity-0 transition-opacity duration-200">
        <Card
          name={shortCards[i][j].name}
          pledge={shortCards[i][j].pledge}
          avatarIndex={shortCards[i][j].avatarIndex}
          bgIndex={shortCards[i][j].backgroundIndex}
        />
      </div>
    {/each}
    {#each { length: numOfLongRows } as _, i}
      <div class="long-card-{i}{j} hidden">
        <Longcard
          name={longCards[i][j].name}
          pledge={longCards[i][j].pledge}
          avatarIndex={longCards[i][j].avatarIndex}
          bgIndex={longCards[i][j].backgroundIndex}
        />
      </div>
    {/each}
  {/each}
</div>
