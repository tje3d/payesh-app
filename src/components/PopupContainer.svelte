<script lang="ts">
  import { fromEvent, map, startWith } from 'rxjs'
  import { fly } from 'svelte/transition'
  import { addHash, removeHash, watchHash } from '/src/helpers/location.helper'

  export let key: string

  const visible = watchHash(key)

  const height = fromEvent(window, 'resize').pipe(
    startWith(window.innerHeight),
    map(() => window.innerHeight),
  )

  function close() {
    removeHash(key)
  }
</script>

{#if $visible}
  <div
    transition:fly|local={{ duration: 600, opacity: 1, y: $height }}
    class="fixed inset-0 z-30 bg-light-surface dark:bg-dark-surface overflow-hidden"
  >
    <slot {close} />
  </div>
{/if}
