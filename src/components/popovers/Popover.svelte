<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { ContentAction } from 'svelte-floating-ui'
  import { scale } from 'svelte/transition'
  import { clickOutside } from '/src/actions/click-outside.action'

  export let content: ContentAction
  export let width: string = 'w-64'
  export let origin: string | undefined = undefined

  const dispatcher = createEventDispatcher()

  function onClickOutSide() {
    dispatcher('outside')
  }
</script>

<div
  class={`${width} mt-2 overflow-hidden bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:bg-[#30334e] ${
    $$props.class || ''
  } ${origin || ''} z-50`}
  use:content
  transition:scale|local={{ duration: 100, start: 0.8 }}
  use:clickOutside={onClickOutSide}
>
  <slot />
</div>
