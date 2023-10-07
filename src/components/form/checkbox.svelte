<script lang="ts">
  import Ripple from '/src/actions/ripple.action'
  import IconCheck from '~icons/heroicons/check'

  export let checked: boolean
  export let value: string | number
  export let disabled: boolean | undefined = undefined
  export let color: string = 'primary'

  let ele: HTMLInputElement
  let colorClass: string

  function generateColors() {
    switch (color) {
      case 'red':
        return `border-rose-500 before:bg-rose-500 checked:border-rose-500 checked:bg-rose-500 checked:before:bg-rose-500`

      case 'primary':
      default:
        return `border-primary before:bg-primary checked:border-primary checked:bg-primary checked:before:bg-primary`
    }
  }

  $: {
    colorClass = generateColors()
  }
</script>

<label class="relative flex cursor-pointer items-center rounded-full p-3" use:Ripple>
  <input
    type="checkbox"
    class={`before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10 ${colorClass}`}
    {disabled}
    {value}
    bind:checked
    on:change
  />
  <div
    class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
  >
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <IconCheck class="w-3.5 h-3.5" />
    {/if}
  </div>
</label>
