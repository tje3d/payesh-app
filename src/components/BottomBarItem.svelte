<script lang="ts">
  import IconHomeSolid from '~icons/heroicons/home-solid'
  import IconPlus from '~icons/heroicons/plus-circle'
  import IconUser from '~icons/heroicons/user'
  import LightSwitch from '/src/components/light-switch.svelte'
  import { page } from '$app/stores'
  import Ripple from '/src/actions/ripple.action'

  export let href: string
  export let text: string
  export let icon: any
  export let iconActive: any
</script>

<a
  {href}
  class="flex flex-col gap-1 items-center justify-center h-16 w-20"
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
