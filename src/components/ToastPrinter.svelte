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
  <div class="fixed z-[100] left-0 bottom-24 right-0 px-4 pointer-events-none">
    <div
      in:scale|local={{ start: 0.8, duration: 150, easing: cubicInOut }}
      out:scale|local={{ start: 0.9, duration: 150, easing: cubicInOut }}
      class="text-black rounded-lg shadow-lg max-w-sm mx-auto flex flex-row items-center gap-2 p-4"
      class:bg-red-300={$item.type === ToastTypes.ERROR}
      class:bg-teal-300={$item.type === ToastTypes.SUCCESS}
    >
      <div>
        {#if $item.type === ToastTypes.ERROR}
          <IconWarning class="w-5 h-5" />
        {:else}
          <IconCheck class="w-5 h-5" />
        {/if}
      </div>
      <div class="leading-4 text-sm">{$item.message}</div>
    </div>
  </div>
{/if}
