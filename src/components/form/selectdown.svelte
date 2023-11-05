<script lang="ts">
  import {
    animationFrames,
    combineLatest,
    distinctUntilChanged,
    filter,
    fromEvent,
    map,
    switchMap,
    take,
    tap,
  } from 'rxjs'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { shift } from 'svelte-floating-ui/dom'
  import { scale } from 'svelte/transition'
  import IconChevDown from '~icons/heroicons/chevron-down'
  import IconSearch from '~icons/heroicons/magnifying-glass'
  import IconXMark from '~icons/heroicons/x-mark'
  import { clickOutside } from '/src/actions/click-outside.action'
  import focus from '/src/actions/focus.action'
  import KeyboardEvents from '/src/actions/keyboard-events.action'
  import Ripple from '/src/actions/ripple.action'
  import { SvelteSubject } from '/src/bloc/bloc.default'
  import { shareIt } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  export let value: string | boolean | number | undefined = undefined
  export let options: Option[] = []
  export let label: string
  export let disabled: boolean = false
  export let enableSearch: boolean | undefined = undefined

  interface Option {
    value: string | number | boolean
    title: string
  }

  const [eleRef, eleContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
    middleware: [shift()],
  })

  const list$ = new SvelteSubject<Option[]>([])
  const enableSearch$ = new SvelteSubject<boolean | undefined>(enableSearch)
  const searchText = new SvelteSubject<string | undefined>(undefined)
  const isFocus = new SvelteSubject<boolean>(false)
  const selected = new SvelteSubject<string | number | boolean | undefined>(value)
  const showDropdown = new SvelteSubject<boolean>(false)
  const selectedTitle = combineLatest([selected, list$]).pipe(
    map(([selected, opts]) => opts.find((opt) => opt.value === selected)?.title),
  )
  const hoverIndex = new SvelteSubject<number>(-1)
  const isEmpty = selectedTitle.pipe(map((val) => typeof val === 'undefined'))
  const filteredOptions = searchText.pipe(
    switchMap((search) => {
      if (!search) {
        return list$
      }

      const regex = new RegExp(search, 'g')

      return list$.pipe(
        map((list) => {
          return list.filter((item) => {
            return (
              regex.test(item.title) || (typeof item.value === 'string' && regex.test(item.value))
            )
          })
        }),
      )
    }),
    shareIt(),
  )

  const hasSearch = combineLatest([enableSearch$.pipe(distinctUntilChanged()), list$]).pipe(
    map(([enable, list]) => {
      if (enable) {
        return true
      }

      return list.length > 5
    }),
    distinctUntilChanged(),
    shareIt(),
  )

  let ele: HTMLDivElement | undefined
  let selectedIndex: undefined | number = undefined
  let optionsContainer: HTMLDivElement | undefined

  $: {
    enableSearch$.next(enableSearch)
  }

  $: {
    list$.next(options)
  }

  function onFocus() {
    isFocus.next(true)
  }

  function onBlur() {
    isFocus.next(false)
  }

  function onClickOutSide() {
    showDropdown.next(false)
  }

  function onSelect(index: number) {
    ele && ele.focus()

    if (!$filteredOptions[index]) {
      return
    }

    selected.next($filteredOptions[index].value)
    selectedIndex = index
    showDropdown.next(false)
  }

  function onArrowDown() {
    !disabled && showDropdown.next(true)
    hoverNextIndex()
    goToHoverIndex()
  }

  function onArrowUp() {
    !disabled && showDropdown.next(true)
    hoverPrevIndex()
    goToHoverIndex()
  }

  function hoverNextIndex() {
    const next = $hoverIndex + 1

    hoverIndex.next(next > $filteredOptions.length - 1 ? 0 : next)
  }

  function hoverPrevIndex() {
    if ($hoverIndex === -1) {
      hoverIndex.next(0)
      return
    }

    const prev = $hoverIndex - 1

    hoverIndex.next(prev < 0 ? $filteredOptions.length - 1 : prev)
  }

  function onEnter() {
    if (!$showDropdown) {
      showDropdown.next(true)
      return
    }

    onSelect($hoverIndex)
  }

  function goToHoverIndex() {
    if ($hoverIndex === -1 || !optionsContainer) {
      return
    }

    const target = optionsContainer.querySelectorAll('div')[$hoverIndex]

    if (target) {
      target.scrollIntoView()
    }
  }

  function clearSearch() {
    searchText.next(undefined)
  }

  function toggleShowDropdown() {
    showDropdown.next(!$showDropdown)
  }

  // @ts-ignore
  unDestroy(fromEvent(document.body, 'keydown'), (e: KeyboardEvent) => {
    if (disabled || !$showDropdown) {
      return
    }

    if (e.code === 'Tab') {
      e.preventDefault()
    }
  })

  unDestroy(
    showDropdown.pipe(
      distinctUntilChanged(),
      tap((status) => {
        if (!status) {
          hoverIndex.next(-1)
        }
      }),
    ),
  )

  unDestroy(selected, (item) => (value = item))

  // Scroll to hover index or selected index
  unDestroy(
    showDropdown.pipe(
      distinctUntilChanged(),
      filter((status) => !!status),
      switchMap(() => animationFrames().pipe(take(1))),
      switchMap(() => list$),
    ),
    (listOptions) => {
      if (optionsContainer && $selected) {
        const idx = listOptions.findIndex((item) => item.value === $selected)

        if (idx !== -1) {
          hoverIndex.next(idx)
          goToHoverIndex()
        }
      }
    },
  )

  unDestroy(showDropdown.pipe(distinctUntilChanged()), (status) => {
    if (!status) {
      searchText.next(undefined)
    }
  })

  // Reset hover index on search
  unDestroy(searchText, () => {
    hoverIndex.next(0)
  })
</script>

<div class="relative" use:clickOutside={onClickOutSide}>
  <div class="h-14 w-full min-w-[200px]">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class={`selectdown border-blue-gray-200 text-blue-gray-700 dark:text-blue-gray-200 flex h-full w-full cursor-pointer items-center rounded-[7px] border bg-transparent px-3 py-2.5 text-sm font-normal outline outline-0 transition-all focus:border-2 focus:border-primary focus:outline-0 dark:focus:border-primary ${
        $isEmpty
          ? 'border-blue-gray-200 border-t-blue-gray-200 border dark:border-gray-600 dark:border-t-gray-600'
          : 'border-t-transparent focus:border-t-transparent dark:focus:border-t-transparent'
      } ${disabled ? 'bg-blue-gray-50 border-0' : ''}`}
      class:border-gray-400={!$isEmpty}
      use:Ripple
      tabindex="0"
      on:focus={onFocus}
      on:blur={onBlur}
      use:eleRef
      use:KeyboardEvents
      on:Space={() => !disabled && showDropdown.next(true)}
      on:Escape={() => showDropdown.next(false)}
      on:click={() => !disabled && toggleShowDropdown()}
      on:Enter={onEnter}
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
          class={`duration-350 h-4 w-4 transition-all ${$showDropdown ? 'rotate-180' : ''}`}
        />
      </div>
    </div>
    <label
      class={`before:content[' '] after:content[' '] before:border-blue-gray-200 after:border-blue-gray-200 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal text-gray-400 transition-all before:pointer-events-none before:ml-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tr-md before:border-r before:border-t before:transition-all after:pointer-events-none after:mr-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tl-md after:border-l after:border-t after:transition-all ${
        $isEmpty ? 'text-sm text-gray-500 before:border-transparent after:border-transparent' : ''
      } ${
        $isFocus
          ? 'text-[11px] text-primary before:border-r-2 before:border-t-2 after:border-l-2 after:border-t-2'
          : ''
      } ${$isFocus && !$isEmpty ? 'before:!border-primary after:!border-primary' : ''} ${
        disabled
          ? 'text-gray-500 text-transparent before:border-transparent after:border-transparent'
          : ''
      } ${$isEmpty ? 'leading-[4.6]' : 'leading-tight'}`}
      class:before:border-gray-400={!$isEmpty}
      class:after:border-gray-400={!$isEmpty}
    >
      {label}
    </label>
  </div>

  {#if !disabled && $showDropdown && $list$.length > 0}
    <div
      class="absolute right-0 z-20 mt-2 w-full origin-top rounded-md bg-white pb-2 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] dark:bg-[#30334e]"
      class:pt-14={$hasSearch}
      class:pt-2={!$hasSearch}
      use:eleContent
      transition:scale|local={{ duration: 150, start: 0.9 }}
      bind:this={optionsContainer}
    >
      <!-- Search -->
      {#if $hasSearch}
        <div class="absolute left-0 right-0 top-2 h-12 overflow-hidden px-2">
          <div class="flex items-center rounded-full bg-gray-100 px-4 dark:bg-white/10">
            <div
              class="swap swap-rotate"
              on:click={clearSearch}
              class:pointer-events-none={!$searchText}
              tabindex="-1"
              role="button"
            >
              <input type="checkbox" checked={!!$searchText} />

              <IconSearch class="swap-off h-5 w-5" />

              <IconXMark class="swap-on h-5 w-5" />
            </div>
            <div class="flex-auto">
              <input
                type="text"
                class="w-full bg-transparent py-3 pe-1 ps-2 text-sm outline-none"
                placeholder="جستجو"
                maxlength={150}
                spellcheck={false}
                bind:value={$searchText}
                use:KeyboardEvents
                use:focus
                on:Escape={() => showDropdown.next(false)}
                on:Enter={onEnter}
                on:ArrowDown={onArrowDown}
                on:ArrowUp={onArrowUp}
              />
            </div>
          </div>
        </div>
      {/if}
      <!-- Search -->

      <div class="max-h-[300px] overflow-auto">
        {#each $filteredOptions as opt, i (opt.value)}
          <div
            class={`w-full transform px-4 py-3 text-start text-sm capitalize text-gray-600 transition-colors duration-300 dark:text-gray-300 ${
              $selected === opt.value ? 'bg-indigo-500/10 dark:bg-indigo-500/20' : ''
            } ${$hoverIndex === i ? 'bg-black/5 dark:bg-white/5' : ''}`}
            on:click={() => onSelect(i)}
            on:pointerover={() => hoverIndex.next(i)}
            role="button"
            tabindex="-1"
            use:Ripple
          >
            {opt.title}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
