<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconSearch from '~icons/heroicons/magnifying-glass'
  import IconXMark from '~icons/heroicons/x-mark'
  import focus from '/src/actions/focus.action'
  import KeyboardEvents from '/src/actions/keyboard-events.action'
  import Ripple from '/src/actions/ripple.action'
  import { PersonSelect } from '/src/bloc/person.select.bloc'
  import Spinner from '/src/components/Spinner.svelte'
  import { di } from '/src/di/di.default'
  import type { IKhadem } from '/src/entities/khadem.entity'
  import { addHash } from '/src/helpers/location.helper'

  export let close: () => void

  const dispatcher = createEventDispatcher()
  const bloc = di(PersonSelect)

  const personsSearch = bloc.personsSearch
  const personsLoading = bloc.personsLoading
  const persons = bloc.persons

  function clearSearch() {
    personsSearch.next(undefined)
  }

  function addPerson() {
    addHash('newPerson')
  }

  function select(person: IKhadem) {
    dispatcher('select', person)
  }

  onDestroy(() => {
    bloc.personsSearch.next(undefined)
    bloc.error.next(undefined)
  })
</script>

<div class="h-full w-full pt-28">
  <div
    class="absolute top-0 right-0 left-0 z-10 px-4 py-2 flex flex-col bg-light-surface-2 dark:bg-dark-surface-2 gap-2"
  >
    <div class="flex items-center">
      <div class="flex-auto">انتخاب خادم</div>

      <button class="btn circle ghost gray" on:click={close}>
        <IconArrowLeft class="w-5 h-5" />
      </button>
    </div>

    <!-- Search -->
    <div>
      <div class="flex items-center bg-gray-100 dark:bg-white/10 rounded-full px-4">
        <div
          class="swap swap-rotate"
          on:click={clearSearch}
          class:pointer-events-none={!$personsSearch}
          tabindex="-1"
          role="button"
        >
          <input type="checkbox" checked={!!$personsSearch} />

          <IconSearch class="swap-off w-5 h-5" />

          <IconXMark class="swap-on w-5 h-5" />
        </div>
        <div class="flex-auto">
          <input
            type="text"
            class="w-full bg-transparent h-8 my-2 outline-none ps-2 pe-1"
            placeholder="نام و نام خانوادگی یا کدخدمتی..."
            maxlength={150}
            spellcheck={false}
            bind:value={$personsSearch}
            use:KeyboardEvents
            on:Escape={clearSearch}
            use:focus
          />
        </div>
      </div>
    </div>
    <!-- Search -->
  </div>

  <div class="h-full overflow-auto p-4">
    {#if $persons.length === 0 && $personsLoading}
      <div class="mt-4 flex justify-center">
        <Spinner class="w-6 h-6" />
      </div>
    {/if}

    {#if $persons.length === 0 && !$personsLoading}
      <button type="button" class="btn indigo w-full text-sm" on:click={addPerson}>
        ثبت خادم جدید
      </button>
    {/if}

    <div class="flex flex-col gap-4">
      {#each $persons as person, i (person.id)}
        <div
          class="btn font-normal gray bg-white dark:bg-white/5 shadow-none border dark:border-gray-700 icon cursor-pointer py-3 px-2 text-base"
          use:Ripple
          on:click={() => select(person)}
          role="button"
          aria-pressed="true"
          tabindex={0}
        >
          <div class="flex-auto flex items-center gap-2">
            <div class="shrink-0">
              <img
                class="object-cover w-10 h-10 rounded-full bg-gray-100"
                alt="تصویر"
                src="https://placehold.co/40x40"
              />
            </div>
            <div>
              <div class="text-sm mb-1">{person.first_name} {person.last_name}</div>
              <div class="text-gray-500">{person.code}</div>
            </div>
          </div>
          <IconArrowLeft class="w-4 h-4 me-2" />
        </div>
      {/each}
    </div>
  </div>
</div>
