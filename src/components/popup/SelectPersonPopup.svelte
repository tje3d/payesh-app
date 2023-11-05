<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { fly, slide } from 'svelte/transition'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconSearch from '~icons/heroicons/magnifying-glass'
  import IconXMark from '~icons/heroicons/x-mark'
  import focus from '/src/actions/focus.action'
  import KeyboardEvents from '/src/actions/keyboard-events.action'
  import Ripple from '/src/actions/ripple.action'
  import { PersonSelect } from '/src/bloc/person.select.bloc'
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import Spinner from '/src/components/Spinner.svelte'
  import CreatePersonPopup from '/src/components/popup/CreatePersonPopup.svelte'
  import { di } from '/src/di/di.default'
  import type { IKhadem } from '/src/entities/khadem.entity'
  import { addHash } from '/src/helpers/location.helper'
  import { flip } from 'svelte/animate'

  export let close: () => void

  const dispatcher = createEventDispatcher()
  const bloc = di(PersonSelect)

  const search = bloc.search
  const loading = bloc.persons.loading
  const filtered = bloc.filtered

  function clearSearch() {
    search.next(undefined)
  }

  function addPerson() {
    addHash('newPerson')
  }

  function select(person: IKhadem) {
    dispatcher('select', person)
  }

  onDestroy(() => {
    bloc.search.next(undefined)
  })
</script>

<div class="pt-28">
  <div
    class="fixed left-0 right-0 top-0 z-10 flex flex-col gap-2 bg-light-surface-2 px-4 py-2 shadow-md dark:bg-dark-surface-2"
  >
    <div class="flex items-center">
      <div class="flex-auto">انتخاب خادم</div>

      <button class="btn circle ghost gray" on:click={close}>
        <IconArrowLeft class="h-5 w-5" />
      </button>
    </div>

    <!-- Search -->
    <div>
      <div class="flex items-center rounded-full bg-gray-100 px-4 dark:bg-white/10">
        <div
          class="swap swap-rotate"
          on:click={clearSearch}
          class:pointer-events-none={!$search}
          tabindex="-1"
          role="button"
        >
          <input type="checkbox" checked={!!$search} />

          <IconSearch class="swap-off h-5 w-5" />

          <IconXMark class="swap-on h-5 w-5" />
        </div>
        <div class="flex-auto">
          <input
            type="text"
            class="my-2 h-8 w-full bg-transparent pe-1 ps-2 outline-none"
            placeholder="نام و نام خانوادگی یا کدخدمتی..."
            maxlength={150}
            spellcheck={false}
            bind:value={$search}
            use:KeyboardEvents
            on:Escape={clearSearch}
            use:focus
          />
        </div>
      </div>
    </div>
    <!-- Search -->
  </div>

  <div class="p-4">
    {#if $filtered.length === 0 && $loading}
      <div transition:slide|local class="mb-4 flex justify-center">
        <Spinner class="h-6 w-6" />
      </div>
    {/if}

    {#if $filtered.length === 0 && $search}
      <button
        in:fly|local={{ y: -10 }}
        type="button"
        class="btn primary w-full text-sm"
        on:click={addPerson}
      >
        ثبت خادم جدید
      </button>
    {/if}

    <div class="flex flex-col gap-4">
      {#each $filtered as person, i (person.id)}
        <div
          animate:flip={{ duration: 300 }}
          class="btn gray icon cursor-pointer rounded-2xl bg-white px-2 py-3 text-base font-normal shadow-sm dark:bg-white/5"
          use:Ripple
          on:click={() => select(person)}
          role="button"
          aria-pressed="true"
          tabindex={0}
        >
          <div class="flex flex-auto items-center gap-2">
            <div class="shrink-0">
              <img
                class="h-10 w-10 rounded-full bg-gray-100 object-cover"
                alt="تصویر"
                src="https://placehold.co/40x40"
              />
            </div>
            <div>
              <div class="mb-1 text-sm">{person.first_name} {person.last_name}</div>
              <div class="text-gray-500">{person.code}</div>
            </div>
          </div>
          <IconArrowLeft class="me-2 h-4 w-4" />
        </div>
      {/each}
    </div>
  </div>
</div>

<PopupContainer key="newPerson" let:close>
  <CreatePersonPopup {close} on:created={(e) => select(e.detail)} />
</PopupContainer>
