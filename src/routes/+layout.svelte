<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="fixed top-0 left-0 w-full h-full z-[-10]">
  <img
    src="/background.jpg"
    alt="background"
    class="w-full h-full object-cover"
  />
</div>

{@render children()}
