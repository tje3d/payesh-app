<script lang="ts">
  import { onMount } from 'svelte'
  import * as FocusAction from '/src/actions/focus.action'
  import OnlyNumber from '/src/actions/only-number.action'
  import { slide } from 'svelte/transition'

  export let value: string | number | undefined = ''
  export let label: string
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let focus: boolean = false
  export let textArea: boolean = false
  export let height: string = 'h-14'
  export let onlyNumber: boolean = false
  export let maxLength: number = 110
  export let password: boolean = false
  export let error: string | string[] | undefined = undefined

  let input: HTMLInputElement | HTMLTextAreaElement
  let isEmpty = true

  $: isEmpty = (value + '').length === 0

  function onFocus(this: HTMLInputElement | HTMLTextAreaElement) {
    this.select()
  }

  onMount(() => {
    if (input instanceof HTMLInputElement) {
      if (password) {
        input.type = 'password'
      } else {
        input.type = 'text'
      }
    }
  })
</script>

<div class={`relative w-full min-w-[200px] ${height}`}>
  {#if !textArea}
    <input
      bind:this={input}
      class="peer h-full w-full rounded-[7px] border border-gray-200 hide-border-t-notempty bg-transparent px-3 py-2.5 text-sm font-normal text-gray-700 dark:text-gray-200 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 dark:placeholder-shown:border-gray-600 dark:placeholder-shown:border-t-gray-600 focus:border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:border-t-transparent dark:focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50 dark:disabled:bg-white/5"
      class:border-gray-400={!isEmpty}
      placeholder=" "
      type="text"
      maxlength={maxLength}
      use:FocusAction.default={focus}
      use:OnlyNumber={{ enable: onlyNumber }}
      on:focus={onFocus}
      bind:value
      {disabled}
      {readonly}
    />
  {:else}
    <textarea
      bind:this={input}
      class="peer h-full w-full rounded-[7px] border border-gray-200 hide-border-t-notempty bg-transparent px-3 py-2.5 text-sm font-normal text-gray-700 dark:text-gray-200 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 dark:placeholder-shown:border-gray-600 dark:placeholder-shown:border-t-gray-600 focus:border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:border-t-transparent dark:focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50 dark:disabled:bg-white/5 pt-4"
      class:border-gray-400={!isEmpty}
      placeholder=" "
      on:focus={onFocus}
      {disabled}
      {readonly}
    />
  {/if}
  <label
    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:ml-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tr-md before:border-t before:border-r before:border-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:mr-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tl-md after:border-t after:border-l after:border-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.75] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-r-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-l-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500"
    class:before:border-gray-400={!isEmpty}
    class:after:border-gray-400={!isEmpty}
  >
    {label}
  </label>
</div>

{#if error}
  <div class="font-bold text-xs text-red-500 mt-2" in:slide|local={{ duration: 150 }}>
    {Array.isArray(error) ? error[0] : error}
  </div>
{/if}
