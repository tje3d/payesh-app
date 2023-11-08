<script lang="ts">
  import { distinctUntilChanged, fromEvent, map, startWith } from 'rxjs'
  import { fly } from 'svelte/transition'
  import { removeHash, watchHash } from '/src/helpers/location.helper'

  export let key: string
  export let baseZIndex = 30

  const visible = watchHash(key)

  const height = fromEvent(window, 'resize').pipe(
    startWith(window.innerHeight),
    map(() => window.innerHeight),
  )

  const zIndex = visible.pipe(
    distinctUntilChanged(),
    map((status) => {
      if (!status) {
        return baseZIndex
      }

      const len = document.querySelectorAll('.popindex').length

      return baseZIndex + len
    }),
  )

  function close() {
    removeHash(key)
  }
</script>

{#if $visible}
  <div
    transition:fly|local={{ duration: 300, opacity: 1, y: $height }}
    class="popindex fixed inset-0 overflow-auto overscroll-contain bg-light dark:bg-dark"
    style={`z-index: ${$zIndex}`}
  >
    <slot {close} />
  </div>
{/if}
