<script lang="ts">
  import { fade } from 'svelte/transition'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconArrowRight from '~icons/heroicons/arrow-right'
  import IconSearch from '~icons/heroicons/magnifying-glass'
  import Ripple from '/src/actions/ripple.action'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import Checkbox from '/src/components/form/checkbox.svelte'
  import InputText from '/src/components/form/input-text.svelte'
  import Selectdown from '/src/components/form/selectdown.svelte'
  import { get } from '/src/di/di.default'

  const bloc = get(ReportBloc)

  const step = bloc.step$
  const taghsim = bloc.taghsim$
  const bakhsh = bloc.bakhsh$
  const selectedPerson = bloc.selectedPerson$
  const personsSearch = bloc.personsSearch$
  const personsLoading = bloc.personsLoading$
  const persons = bloc.persons$
  const canSelectPerson = bloc.canSelectPerson$
  const personOptions = bloc.personOptions$
  const selectedOptions = bloc.selectedOptions$
  const hasSelectedOptions = bloc.hasSelectedOptions$

  let optionsIndexChecked: { [key: number]: boolean } = {}

  if ($selectedOptions.length > 0) {
    $selectedOptions.forEach((id) => (optionsIndexChecked[id] = true))
  }

  function selectFirstSearchResult() {
    if ($persons.length !== 1) {
      return
    }

    selectedPerson.next($persons[0])
  }

  function onOptionChanges(e: Event) {
    // (e.target as HTMLInputElement).checked
    const keys = Object.keys(optionsIndexChecked).map((id) => +id)
    const newIds = keys
      .map((item) => (optionsIndexChecked[item] ? item : null))
      .filter((item) => item !== null) as number[]
    selectedOptions.next(newIds)
  }

  function selectAnotherPerson() {
    if ($hasSelectedOptions) {
      return
    }

    selectedPerson.next(undefined)
    optionsIndexChecked = {}
  }
</script>

{#if typeof $selectedPerson === 'undefined'}
  <div class="flex flex-col gap-8 py-8">
    <div>
      <div class="px-4 mb-4 font-bold text-sm">اطلاعات سازمانی</div>

      <div class="mx-4 bg-white dark:bg-[#30334e] shadow-sm rounded-lg p-4 flex flex-col gap-4">
        <Selectdown
          bind:value={$taghsim}
          label="انتخاب تقسیم بندی"
          options={[
            { title: 'انتظامات', value: 0 },
            { title: 'ویلچر', value: 1 },
          ]}
        />

        <Selectdown
          bind:value={$bakhsh}
          label="انتخاب بخش"
          options={[
            { title: 'بخش اول', value: 0 },
            { title: 'بخش دوم', value: 1 },
            { title: 'بخش سوم', value: 2 },
            { title: 'بخش چهارم', value: 3 },
            { title: 'بخش پنجم', value: 4 },
          ]}
        />
      </div>
    </div>

    {#if $canSelectPerson}
      <div class:opacity-50={!$canSelectPerson} class:pointer-events-none={!$canSelectPerson}>
        <div class="px-4 mb-4 font-bold text-sm">انتخاب خادم</div>

        <div class="mx-4 bg-white dark:bg-[#30334e] shadow-sm rounded-lg p-4">
          <InputText
            label="نام و نام خانوادگی یا کدخدمتی..."
            class="pe-12"
            bind:value={$personsSearch}
            on:Enter={selectFirstSearchResult}
            focus={true}
          >
            <svelte:fragment slot="icon">
              <IconSearch class="w-4 h-4" />
            </svelte:fragment>
          </InputText>
        </div>

        {#if $persons.length === 0 && !$personsLoading}
          <div class="mx-4 mt-4">
            <button type="button" class="btn indigo w-full">ثبت خادم جدید</button>
          </div>
        {/if}

        {#each $persons as person, i (person.id)}
          <div class="px-4 mt-4">
            <div
              class="btn font-normal gray bg-white dark:bg-white/5 shadow-lg icon cursor-pointer py-3 px-2"
              use:Ripple
              on:click={() => selectedPerson.next(person)}
              role="button"
              aria-pressed="true"
              tabindex={0}
            >
              <div class="flex-auto flex items-center gap-2">
                <div class="shrink-0">
                  <img
                    class="object-cover w-10 h-10 rounded-full bg-gray-100"
                    src={person.image}
                    alt="تصویر"
                  />
                </div>
                <div>
                  <div class="text-sm mb-1">{person.name}</div>
                  <div class="text-gray-500">{person.code}</div>
                </div>
              </div>
              <IconArrowLeft class="w-4 h-4 me-2" />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class="py-8">
    <!-- info -->
    <div class="rounded-lg bg-white shadow-sm mx-4 p-4 flex gap-4 items-center dark:bg-[#30334e]">
      <div>
        <img class="rounded-full w-20 h-20" src={$selectedPerson.image} />
      </div>
      <div>
        <div class="mb-1">
          <div class="font-bold">{$selectedPerson.name}</div>
          <div class="text-sm text-gray-500">{$selectedPerson.code}</div>
        </div>
        <div class="text chip ghost teal">طرح و برنامه</div>
      </div>
    </div>
    <!-- info -->

    <!-- options -->
    <div class="mt-4 px-4 flex flex-col gap-4">
      {#each $personOptions as option (option.id)}
        <label
          class="btn font-normal text-sm rounded-lg cursor-pointer bg-white dark:bg-[#30334e] shadow-lg icon justify-between pe-2"
          use:Ripple
        >
          <div>{option.name}</div>

          <div>
            <Checkbox
              on:change={onOptionChanges}
              bind:checked={optionsIndexChecked[option.id]}
              value={option.id}
            />
          </div>
        </label>
      {/each}
    </div>
    <!-- options -->

    {#if !$hasSelectedOptions}
      <div class="mt-6 px-4 flex justify-center" in:fade|local>
        <button type="button" class="btn pink icon" on:click={selectAnotherPerson}>
          <IconArrowRight class="w-4 h-4" />
          <span>انتخاب مجدد خادم</span>
        </button>
      </div>
    {:else}
      <div class="mt-6 px-4 flex items-center justify-between" in:fade|local>
        <button type="button" class="btn indigo ghost opacity-50">
          <span> ذخیره برای ارسال آفلاین </span>
        </button>

        <button type="button" class="btn indigo icon shrink-0">
          <span>ارسال اطلاعات</span>
          <IconArrowLeft class="w-4 h-4" />
        </button>
      </div>
    {/if}
  </div>
{/if}
