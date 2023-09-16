<script lang="ts">
  import { map, tap } from 'rxjs'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { flip, shift } from 'svelte-floating-ui/dom'
  import { scale } from 'svelte/transition'
  import IconChevDown from '~icons/heroicons/chevron-down'
  import { clickOutside } from '/src/actions/click-outside.action'
  import KeyboardEvents from '/src/actions/keyboard-events.action'
  import Ripple from '/src/actions/ripple.action'
  import { SvelteSubject } from '/src/bloc/bloc.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  export let value: string | boolean | number | undefined = undefined
  export let options: Option[] = []
  export let label: string
  export let disabled: boolean = false

  interface Option {
    value: string | number | boolean
    title: string
  }

  const [eleRef, eleContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [flip(), shift()],
  })

  const isFocus = new SvelteSubject<boolean>(false)
  const selected = new SvelteSubject<string | number | boolean | undefined>(value)
  const showDropdown = new SvelteSubject<boolean>(false)
  const selectedTitle = selected.pipe(
    map((selected) => options.find((opt) => opt.value === selected)?.title),
  )
  const hoverIndex = new SvelteSubject<number>(-1)
  const isEmpty = selectedTitle.pipe(map((val) => typeof val === 'undefined'))

  let ele: HTMLDivElement | undefined
  let nativeSelect: HTMLSelectElement | undefined

  function onFocus() {
    isFocus.next(true)

    !disabled && showDropdown.next(true)
  }

  function onBlur() {
    isFocus.next(false)
  }

  function onClickOutSide() {
    showDropdown.next(false)
  }

  function onSelect(opt: Option | number) {
    ele && ele.focus()

    if (typeof opt === 'number') {
      if (!options[opt]) {
        return
      }

      opt = options[opt]
    }

    selected.next(opt.value)
    showDropdown.next(false)
  }

  function onArrowDown() {
    !disabled && showDropdown.next(true)
    hoverNextIndex()
  }

  function onArrowUp() {
    !disabled && showDropdown.next(true)
    hoverPrevIndex()
  }

  function hoverNextIndex() {
    const next = $hoverIndex + 1

    hoverIndex.next(next > options.length - 1 ? 0 : next)
  }

  function hoverPrevIndex() {
    if ($hoverIndex === -1) {
      hoverIndex.next(0)
      return
    }

    const prev = $hoverIndex - 1

    hoverIndex.next(prev < 0 ? options.length - 1 : prev)
  }

  unDestroy(
    showDropdown.pipe(
      tap((status) => {
        if (!status) {
          hoverIndex.next(-1)
        }
      }),
    ),
  )

  unDestroy(selected, (item) => (value = item))
</script>

<div class="relative" use:clickOutside={onClickOutSide}>
  <div class="h-14 w-full min-w-[200px]">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class={`h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 text-sm font-normal text-blue-gray-700 dark:text-blue-gray-200 outline outline-0 transition-all focus:border-2 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-0 flex items-center cursor-pointer ${
        $isEmpty
          ? 'border border-blue-gray-200 border-t-blue-gray-200 dark:border-gray-600 dark:border-t-gray-600'
          : 'border-t-transparent focus:border-t-transparent dark:focus:border-t-transparent'
      } ${disabled ? 'border-0 bg-blue-gray-50' : ''}`}
      class:border-gray-400={!$isEmpty}
      use:Ripple
      tabindex="0"
      on:focus={onFocus}
      on:blur={onBlur}
      use:eleRef
      use:KeyboardEvents
      on:Space={() => !disabled && showDropdown.next(true)}
      on:Escape={() => showDropdown.next(false)}
      on:click={() => !disabled && showDropdown.next(true)}
      on:Enter={() => onSelect($hoverIndex)}
      on:Tab={() => showDropdown.next(false)}
      on:ArrowDown={onArrowDown}
      on:ArrowUp={onArrowUp}
      bind:this={ele}
    >
      {#if $selectedTitle}
        {$selectedTitle}
      {/if}

      <div class="absolute end-4 top-1/2 -mt-2">
        <IconChevDown
          class={`w-4 h-4 transition-all duration-350 ${$showDropdown ? 'rotate-180' : ''}`}
        />
      </div>
    </div>
    <label
      class={`before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal text-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:ml-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tr-md before:border-t before:border-r before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:mr-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tl-md after:border-t after:border-l after:border-blue-gray-200 after:transition-all ${
        $isEmpty ? 'text-sm text-gray-500 before:border-transparent after:border-transparent' : ''
      } ${
        $isFocus
          ? 'text-[11px] text-blue-500 before:border-t-2 before:border-r-2 after:border-t-2 after:border-l-2'
          : ''
      } ${$isFocus && !$isEmpty ? 'before:!border-blue-500 after:!border-blue-500' : ''} ${
        disabled
          ? 'text-transparent before:border-transparent after:border-transparent text-gray-500'
          : ''
      } ${$isEmpty ? 'leading-[4.6]' : 'leading-tight'}`}
      class:before:border-gray-400={!$isEmpty}
      class:after:border-gray-400={!$isEmpty}
    >
      {label}
    </label>
  </div>

  {#if !disabled && $showDropdown}
    <div
      class="absolute right-0 z-20 w-full py-2 mt-2 origin-top bg-white dark:bg-[#30334e] rounded-md shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] max-h-[300px] overflow-auto"
      use:eleContent
      transition:scale|local={{ duration: 150, start: 0.9 }}
    >
      {#each options as opt, i (opt.value)}
        <button
          class={`w-full text-start px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 ${
            $selected === opt.value ? 'bg-indigo-500/10 dark:bg-indigo-500/20' : ''
          } ${$hoverIndex === i ? 'bg-black/5 dark:bg-white/5' : ''}`}
          on:click={() => onSelect(opt)}
          on:pointerover={() => hoverIndex.next(i)}
          tabindex="-1"
          use:Ripple
        >
          {opt.title}
        </button>
      {/each}
    </div>
  {/if}
</div>
