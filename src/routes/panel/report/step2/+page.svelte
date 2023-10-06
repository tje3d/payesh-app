<script lang="ts">
  import { goto } from '$app/navigation'
  import dayjs from 'dayjs'
  import { onDestroy, onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconArrowRight from '~icons/heroicons/arrow-right'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { OfflineReportBloc } from '/src/bloc/offline.report.bloc'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import { ToastBloc } from '/src/bloc/toast.bloc'
  import Spinner from '/src/components/Spinner.svelte'
  import Checkbox from '/src/components/form/checkbox.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di } from '/src/di/di.default'
  import { addHash } from '/src/helpers/location.helper'
  import { isDeviceOnline } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const bloc = di(ReportBloc)
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
    goto('/panel/report/step1')
  }

  function buildInspectReport() {
    if (!$management || !$office || !$post || !$selectedPerson) {
      return
    }

    const [date, time] = dayjs().calendar('gregory').format('YYYY-MM-DD HH:mm:ss').split(' ')

    return {
      organ_management: +$management,
      organ_office: +$office,
      organ_post: +$post,
      person: $selectedPerson.id,
      date,
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
    goto('/panel/report/step1')
  }

  function resetSelectedOptions() {
    selectedOptions.next([])
    optionsIndexChecked = {}
  }

  onMount(() => {
    bloc.step.next(2)

    if (!$selectedPerson) {
      back()
    }
  })

  onDestroy(() => {
    bloc.send.error.next(undefined)
  })

  unDestroy(send, (result) => {
    if (result) {
      resetSelectedOptions()
      goto('/panel/report/step1')

      di(ToastBloc).success(result)
    }
  })

  unDestroy(bloc.send.error, (e) => {
    if (e) {
      di(ToastBloc).error(e.message)
    }
  })
</script>

<MetaTitle titles={['ثبت گزارش', 'موارد']} />

{#if $selectedPerson}
  <div class="py-8 pb-8" use:focusTrap>
    <!-- info -->
    <div
      class="mx-4 rounded-lg shadow-sm bg-light-surface-2 dark:bg-dark-surface-2"
      on:click={() => addHash('selectPerson')}
      role="button"
      tabindex="-1"
    >
      <div class="flex gap-4 items-center p-4 vt-person-info">
        <div>
          <img class="rounded-full w-20 h-20" alt="تصویر" src="https://placehold.co/80x80" />
        </div>
        <div class="flex flex-col gap-1">
          <div>
            <div>
              {$selectedPerson.first_name}
              {$selectedPerson.last_name}
            </div>
            <div class="text-sm text-gray-500">{$selectedPerson.code}</div>
          </div>
          <div class="text chip ghost teal">طرح و برنامه</div>
        </div>
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
      {:else}
        <div class="flex items-center justify-center">
          <Spinner class="w-5 h-5" />
        </div>
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
      <div class="mt-6 px-4 flex items-center justify-between">
        <button
          type="button"
          class="btn indigo"
          class:ghost={$isDeviceOnline}
          class:opacity-50={$isDeviceOnline}
          on:click|preventDefault={storeOffline}
          in:fly|local={{ x: 20 }}
        >
          <span> ذخیره برای ارسال آفلاین </span>
        </button>

        <button
          type="button"
          class="btn indigo icon shrink-0"
          class:loading={$sendLoading}
          on:click|preventDefault={onSubmit}
          disabled={!$isDeviceOnline}
          in:fly|local={{ x: -20 }}
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
