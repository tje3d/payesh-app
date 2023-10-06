<script lang="ts">
  import Ripple from '/src/actions/ripple.action'

  export let checked: boolean
  export let value: string | number
  export let disabled: boolean | undefined = undefined

  let ele: HTMLInputElement
</script>

<label class="relative flex cursor-pointer items-center rounded-full p-3" use:Ripple>
  <input
    type="checkbox"
    class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
    {disabled}
    {value}
    bind:checked
    on:change
  />
  <div
    class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
    >
      <path
        fill-rule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</label>
