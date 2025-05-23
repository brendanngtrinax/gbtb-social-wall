<script lang="ts">
  let { name, pledge, avatarIndex, backgroundIndex } = $props();
  import { avatarImgPaths, backgroundImgPaths } from "$lib/shared";
</script>

<div
  class="longcard relative w-[300px] h-[300px] rounded-[20px] bg-purple-100 flex overflow-hidden transition ease-out shadow-lg"
>
  <!-- Left side with decorative background -->
  <div
    class="w-1/2 h-full bg-cover bg-center"
    style="background-image: url({backgroundImgPaths[backgroundIndex]})"
  ></div>

  <!-- Right side with white content -->
  <div
    class="w-3/4 h-full bg-white flex flex-col justify-center px-3 text-center rounded-l-none rounded-r-[20px] relative"
  >
    <div class="flex items-center gap-2 h-1/2">
      <img
        class="w-10 h-10 rounded-full bg-gray-300 mb-1"
        src={avatarImgPaths[avatarIndex]}
        alt="Avatar"
      />
      <p class="text-xs font-semibold text-gray-700">{name}</p>
    </div>
    <p class="text-xs text-left text-gray-700 mt-1 h-1/2">{pledge}</p>
  </div>
</div>
