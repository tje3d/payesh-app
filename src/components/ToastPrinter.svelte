<script lang="ts">
  import { cubicInOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'
  import IconCheck from '~icons/heroicons/check-circle'
  import IconWarning from '~icons/heroicons/exclamation-circle'
  import { ToastTypes } from '/src/entities/toast.entity'
  import { di } from '/src/di/di.default'
  import { ToastBloc } from '/src/bloc/toast.bloc'

  const toast = di(ToastBloc)
  const item = toast.list
</script>

{#if $item}
  <div class="pointer-events-none fixed bottom-24 left-0 right-0 z-[100] px-4">
    <div
      in:scale|local={{ start: 0.8, duration: 150, easing: cubicInOut }}
      out:scale|local={{ start: 0.9, duration: 150, easing: cubicInOut }}
      class="mx-auto flex max-w-sm flex-row items-center gap-2 rounded-lg p-4 text-black shadow-lg"
      class:bg-red-300={$item.type === ToastTypes.ERROR}
      class:bg-teal-300={$item.type === ToastTypes.SUCCESS}
    >
      <div>
        {#if $item.type === ToastTypes.ERROR}
          <IconWarning class="h-5 w-5" />
        {:else}
          <IconCheck class="h-5 w-5" />
        {/if}
      </div>
      <div class="text-sm leading-4">{$item.message}</div>
    </div>
  </div>
{/if}
