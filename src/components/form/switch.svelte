<script lang="ts">
  export let checked: boolean
</script>

<label class="relative mt-0.5 inline-block h-4 w-8 cursor-pointer rounded-full">
  <input
    type="checkbox"
    class="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-gray-400 transition-colors duration-300 checked:bg-indigo-500 peer-checked:border-indigo-500 peer-checked:before:bg-indigo-500"
    bind:checked
    on:change
  />
  <div
    class="before:content[''] absolute -left-1 top-2/4 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-gray-400 bg-white shadow-md transition-all duration-300 before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-indigo-500 peer-checked:before:bg-indigo-500"
  />
</label>
