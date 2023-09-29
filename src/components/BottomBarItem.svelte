<script lang="ts">
  import { page } from '$app/stores'

  export let href: string
  export let text: string
  export let icon: any
  export let iconActive: any
</script>

<a
  {href}
  class="flex flex-col gap-2 items-center justify-center h-20 w-20"
  class:text-gray-500={$page.route.id !== href}
  class:text-teal-600={$page.route.id === href}
>
  {#if $page.route.id === href}
    <svelte:component this={iconActive} class="w-6 h-6" />
  {:else}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}
  <span class="text-xs">{text}</span>
</a>
