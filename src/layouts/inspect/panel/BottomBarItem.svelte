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
  class="flex flex-col items-center justify-center relative z-10 h-full w-20 transition-transform transform bottombar-item"
  class:text-gray-500={active}
  class:text-teal-600={active}
  class:scale-90={!active}
  class:scale-100={active}
>
  {#if active}
    <svelte:component this={iconActive} class="w-6 h-6" />
  {:else}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}

  {#if active}
    <span transition:slide|local class="text-xs mt-1">{text}</span>
  {/if}
</a>
