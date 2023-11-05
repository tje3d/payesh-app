<script lang="ts">
  import Ripple from '/src/actions/ripple.action'

  export let checked: boolean | string | undefined = undefined
  export let label: string | undefined = undefined
  export let value: string | boolean | number

  let ele: HTMLInputElement
</script>

<div class="inline-flex items-center">
  <label class="relative flex cursor-pointer items-center rounded-full p-3">
    <input
      type="radio"
      class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-indigo-200 text-indigo-500 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-indigo-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
      bind:group={checked}
      {value}
      bind:this={ele}
    />
    <div
      class="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-indigo-500 opacity-0 transition-opacity peer-checked:opacity-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <circle data-name="ellipse" cx="8" cy="8" r="8" />
      </svg>
    </div>
  </label>
  {#if label}
    <label class="mt-px cursor-pointer select-none font-light text-gray-700">
      {label}
    </label>
  {/if}
</div>
