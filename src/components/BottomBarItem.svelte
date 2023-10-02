<script lang="ts">
  import { map } from 'rxjs'
  import { routeId } from '/src/helpers/observable.helper'

  export let href: string
  export let text: string
  export let icon: any
  export let iconActive: any

  const isActive = routeId.pipe(map((id) => id?.startsWith(href)))
</script>

<a
  {href}
  class="flex flex-col gap-2 items-center justify-center h-20 w-20"
  class:text-gray-500={$isActive}
  class:text-teal-600={$isActive}
>
  {#if $isActive}
    <svelte:component this={iconActive} class="w-6 h-6" />
  {:else}
    <svelte:component this={icon} class="w-6 h-6" />
  {/if}
  <span class="text-xs">{text}</span>
</a>
