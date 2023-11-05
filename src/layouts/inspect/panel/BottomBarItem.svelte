<script lang="ts">
  import { slide } from 'svelte/transition'

  export let href: string
  export let text: string
  export let icon: any
  export let iconActive: any
  export let active: boolean
</script>

<a
  {href}
  class="bottombar-item relative z-10 flex h-full w-20 transform flex-col items-center justify-center transition-transform"
  class:text-gray-500={active}
  class:text-teal-600={active}
  class:scale-90={!active}
  class:scale-100={active}
>
  {#if active}
    <svelte:component this={iconActive} class="h-6 w-6" />
  {:else}
    <svelte:component this={icon} class="h-6 w-6" />
  {/if}

  {#if active}
    <span transition:slide|local class="mt-1 text-xs">{text}</span>
  {/if}
</a>
