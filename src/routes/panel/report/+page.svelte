<script lang="ts">
  import dayjs from 'dayjs'
  import { onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconArrowRight from '~icons/heroicons/arrow-right'
  import IconChevDown from '~icons/heroicons/chevron-down'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { OfflineReportBloc } from '/src/bloc/offline.report.bloc'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import { ToastBloc } from '/src/bloc/toast.bloc'
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import Spinner from '/src/components/Spinner.svelte'
  import Checkbox from '/src/components/form/checkbox.svelte'
  import Selectdown from '/src/components/form/selectdown.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import SelectPersonPopup from '/src/components/popup/SelectPersonPopup.svelte'
  import { di, get } from '/src/di/di.default'
  import type { IKhadem } from '/src/entities/khadem.entity'
  import { addHash, removeHash } from '/src/helpers/location.helper'
  import { isDeviceOnline } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const bloc = get(ReportBloc)
  const dataBloc = di(DataBloc)

  const management = bloc.management
  const office = bloc.office
  const post = bloc.post
  const selectedPerson = bloc.selectedPerson
  const selectedOptions = bloc.selectedOptions
  const hasSelectedOptions = bloc.hasSelectedOptions
  const send = bloc.send.request
  const sendLoading = bloc.send.loading
  const step = bloc.step

  const inspectItems = dataBloc.inspectItems.request
  const organsLoading = dataBloc.organs.loading
  const organs = dataBloc.organs.request

  let optionsIndexChecked: { [key: number]: boolean } = {}

  if ($selectedOptions.length > 0) {
    $selectedOptions.forEach((id) => (optionsIndexChecked[id] = true))
  }

  function onOptionChanges(e: Event) {
    // (e.target as HTMLInputElement).checked
    const keys = Object.keys(optionsIndexChecked).map((id) => +id)
    const newIds = keys
      .map((item) => (optionsIndexChecked[item] ? item : null))
      .filter((item) => item !== null) as number[]
    selectedOptions.next(newIds)
  }

  function back() {
    step.next(0)
    // bloc.resetForNewReport()
    resetSelectedOptions()
  }

  function buildInspectReport() {
    if (!$management || !$office || !$post || !$selectedPerson) {
      return
    }

    const time = dayjs().calendar('gregory').format('YYYY-MM-DD HH:mm')

    return {
      organ_management: +$management,
      organ_office: +$office,
      organ_post: +$post,
      person: $selectedPerson.id,
      time,
      items: $selectedOptions,
    }
  }

  function onSubmit() {
    const report = buildInspectReport()

    if (!report) {
      return
    }

    bloc.send.submit.next(report)
  }

  function storeOffline() {
    const report = buildInspectReport()

    if (!report) {
      return
    }

    di(OfflineReportBloc).add.next(report)

    di(ToastBloc).success('گزارش ذخیره شد')

    resetSelectedOptions()
    step.next(0)
  }

  function onPersonSelect(e: CustomEvent<IKhadem>) {
    selectedPerson.next(e.detail)
    removeHash('selectPerson')
    // step.next(1)
  }

  function resetSelectedOptions() {
    selectedOptions.next([])
    optionsIndexChecked = {}
  }

  onDestroy(() => {
    bloc.send.error.next(undefined)
  })

  unDestroy(send, (result) => {
    if (result) {
      resetSelectedOptions()
      step.next(0)

      di(ToastBloc).success(result)
    }
  })

  unDestroy(bloc.send.error, (e) => {
    if (e) {
      di(ToastBloc).error(e.message)
    }
  })

  unDestroy(step, () => {
    bloc.send.error.next(undefined)
  })
</script>

<MetaTitle titles="ثبت گزارش" />

{#if $step === 0}
  <div class="flex flex-col gap-8 py-8" use:focusTrap>
    <div>
      <div class="px-4 mb-4 font-bold text-sm">اطلاعات سازمانی</div>

      <div
        class="mx-4 bg-light-surface-2 dark:bg-dark-surface-2 shadow-md rounded-lg p-4 flex flex-col gap-4"
      >
        {#if !$organs && $organsLoading}
          <div class="flex justify-center"><Spinner class="w-6 h-6" /></div>
        {:else}
          <Selectdown
            bind:value={$management}
            label="انتخاب مدیریت"
            options={$organs?.managements.map((item) => ({ value: item.id, title: item.title })) ||
              []}
          />

          <Selectdown
            bind:value={$office}
            label="انتخاب اداره"
            options={$organs?.offices.map((item) => ({ value: item.id, title: item.title })) || []}
          />

          <Selectdown
            bind:value={$post}
            label="انتخاب پست"
            options={$organs?.posts.map((item) => ({ value: item.id, title: item.title })) || []}
          />
        {/if}
      </div>
    </div>

    <div class="px-4">
      <div class="mb-4 font-bold text-sm">انتخاب خادم</div>

      <div class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg shadow-md p-4">
        <button
          type="button"
          class="rounded-lg h-14 px-3 flex flex-row items-center w-full text-start border"
          class:border-gray-200={!$selectedPerson}
          class:dark:border-gray-600={!$selectedPerson}
          class:border-gray-400={!!$selectedPerson}
          use:Ripple
          on:click={() => addHash('selectPerson')}
        >
          {#if $selectedPerson}
            <div class="flex-auto">
              <div>
                {$selectedPerson.first_name}
                {$selectedPerson.last_name}
              </div>

              <div class="text-xs text-gray-500">
                {$selectedPerson.code}
              </div>
            </div>
          {:else}
            <div class="flex-auto text-sm text-gray-500">لطفا یک خادم انتخاب کنید</div>
          {/if}

          <div>
            <IconChevDown class="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>

    <div class="px-4 flex items-center justify-between">
      <button
        type="button"
        class="btn indigo icon shrink-0"
        disabled={!$selectedPerson || !$management || !$post || !$office}
        on:click|preventDefault={() => step.next(1)}
      >
        <span>مرحله بعد</span>

        {#if $sendLoading}
          <Spinner class="w-4 h-4 mx-auto" />
        {:else}
          <IconArrowLeft class="w-4 h-4" />
        {/if}
      </button>
    </div>
  </div>
{:else if $step === 1 && $selectedPerson}
  <div class="py-8">
    <!-- info -->
    <div
      class="rounded-lg shadow-sm mx-4 p-4 flex gap-4 items-center bg-light-surface-2 dark:bg-dark-surface-2"
      on:click={() => addHash('selectPerson')}
      role="button"
      tabindex="-1"
    >
      <div>
        <img class="rounded-full w-20 h-20" alt="تصویر" src="https://placehold.co/80x80" />
      </div>
      <div>
        <div class="mb-1">
          <div class="font-bold">{$selectedPerson.first_name} {$selectedPerson.last_name}</div>
          <div class="text-sm text-gray-500">{$selectedPerson.code}</div>
        </div>
        <div class="text chip ghost teal">طرح و برنامه</div>
      </div>
    </div>
    <!-- info -->

    <!-- options -->
    <div class="mt-4 px-4 flex flex-col gap-4">
      {#if $inspectItems}
        {#each $inspectItems as option (option.id)}
          <label
            class="btn font-normal text-sm rounded-lg cursor-pointer bg-light-surface-2 dark:bg-dark-surface-2 shadow-lg icon justify-between pe-2"
            use:Ripple
          >
            <div>{option.title}</div>

            <div>
              <Checkbox
                on:change={onOptionChanges}
                bind:checked={optionsIndexChecked[option.id]}
                value={option.id}
                disabled={$sendLoading}
              />
            </div>
          </label>
        {/each}
      {/if}
    </div>
    <!-- options -->

    {#if !$hasSelectedOptions}
      <div class="mt-6 px-4 flex justify-center" in:fade|local>
        <button type="button" class="btn ghost gray icon" on:click={back}>
          <IconArrowRight class="w-4 h-4" />
          <span>بازگشت</span>
        </button>
      </div>
    {:else}
      <div class="mt-6 px-4 flex items-center justify-between" in:fade|local>
        <button
          type="button"
          class="btn indigo"
          class:ghost={$isDeviceOnline}
          class:opacity-50={$isDeviceOnline}
          on:click|preventDefault={storeOffline}
        >
          <span> ذخیره برای ارسال آفلاین </span>
        </button>

        <button
          type="button"
          class="btn indigo icon shrink-0"
          class:loading={$sendLoading}
          on:click|preventDefault={onSubmit}
          disabled={!$isDeviceOnline}
        >
          <span>ارسال اطلاعات</span>

          {#if $sendLoading}
            <Spinner class="w-4 h-4 mx-auto" />
          {:else}
            <IconArrowLeft class="w-4 h-4" />
          {/if}
        </button>
      </div>
    {/if}
  </div>
{/if}

<PopupContainer key="selectPerson" let:close>
  <SelectPersonPopup {close} on:select={onPersonSelect} />
</PopupContainer>
