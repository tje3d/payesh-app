<script lang="ts">
  import { goto } from '$app/navigation'
  import dayjs from 'dayjs'
  import { combineLatestAll, from, map, switchMap, take } from 'rxjs'
  import { onDestroy, onMount } from 'svelte'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconUpload from '~icons/heroicons/cloud-arrow-up'
  import IconTrash from '~icons/heroicons/trash'
  import IconX from '~icons/heroicons/x-mark'
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
  import { imagePreview, pickFile, resizeImage } from '/src/helpers/file.helper'
  import { addHash } from '/src/helpers/location.helper'
  import { isDeviceOnline } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'
  import { BottomBarBloc } from '/src/bloc/bottombar.bloc'

  const bloc = di(ReportBloc)
  const dataBloc = di(DataBloc)

  const management = bloc.management
  const office = bloc.office
  const file = bloc.file
  const post = bloc.post
  const selectedPerson = bloc.selectedPerson
  const selectedOptions = bloc.selectedOptions
  const send = bloc.send.request
  const sendLoading = bloc.send.loading
  const step = bloc.step

  const inspectItems = dataBloc.inspectItems.request
  const preview = imagePreview(file)

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

  function chooseFile() {
    pickFile('image/*', false, 'environment')
      .pipe(
        take(1),
        switchMap((files) => {
          return from(files).pipe(map((file) => resizeImage(file, 800, 0.8, 'PNG')))
        }),
        combineLatestAll(),
      )
      .subscribe((list) => {
        file.next(list[0])
      })
  }

  function removeFile() {
    file.next(undefined)
  }

  onMount(() => {
    bloc.step.next(2)

    if (!$selectedPerson) {
      back()
    }

    di(BottomBarBloc).backMode.next('/panel/report/step1')
  })

  onDestroy(() => {
    bloc.send.error.next(undefined)

    di(BottomBarBloc).backMode.next(false)
  })

  unDestroy(send, (result) => {
    if (result) {
      resetSelectedOptions()
      file.next(undefined)
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
      class="mx-4 mb-4 rounded-2xl bg-light-surface-2 shadow-sm dark:bg-dark-surface-2"
      on:click={() => addHash('selectPerson')}
      role="button"
      tabindex="-1"
    >
      <div class="vt-person-info flex items-center gap-4 p-4">
        <div>
          <img class="h-20 w-20 rounded-full" alt="تصویر" src="https://placehold.co/80x80" />
        </div>
        <div class="flex flex-col gap-1">
          <div>
            <div>
              {$selectedPerson.first_name}
              {$selectedPerson.last_name}
            </div>
            <div class="text-sm text-gray-500">{$selectedPerson.code}</div>
          </div>
          <!-- <div class="text chip ghost teal">طرح و برنامه</div> -->
        </div>
      </div>
    </div>
    <!-- info -->

    <div class="mb-4 px-4">
      <div class="chip orange ghost whitespace-normal">
        <strong>توجه:</strong>
        خواهشمند است موارد مربوط به عدم آراستگی را مشخص کنید
      </div>
    </div>

    <!-- options -->
    <div class="mb-4 grid grid-cols-2 gap-4 px-4">
      {#if $inspectItems}
        {#each $inspectItems as option (option.id)}
          <label
            class="btn icon cursor-pointer justify-between rounded-2xl bg-light-surface-2 pe-2 text-sm font-normal shadow-sm dark:bg-dark-surface-2"
            use:Ripple
          >
            <div>{option.title}</div>

            <div>
              <Checkbox
                on:change={onOptionChanges}
                bind:checked={optionsIndexChecked[option.id]}
                value={option.id}
                disabled={$sendLoading}
                color="red"
              >
                <svelte:fragment slot="icon">
                  <IconX class="h-3.5 w-3.5" />
                </svelte:fragment>
              </Checkbox>
            </div>
          </label>
        {/each}
      {:else}
        <div class="flex items-center justify-center">
          <Spinner class="h-5 w-5" />
        </div>
      {/if}
    </div>
    <!-- options -->

    <div class="relative mx-auto mb-4 max-w-xl px-4">
      {#if $preview}
        <button
          class="btn circle red absolute left-8 top-4 z-10"
          type="button"
          on:click|preventDefault|stopPropagation={removeFile}
        >
          <IconTrash class="h-4 w-4" />
        </button>
      {/if}

      <div
        class="mx-auto flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-light-surface-2 p-4 text-center dark:border-gray-700 dark:bg-dark-surface-2"
        role="button"
        tabindex="-1"
        on:click={chooseFile}
        use:Ripple
      >
        {#if $preview}
          <img class="aspect-square w-full rounded-2xl object-contain" src={$preview} alt="تصویر" />
        {:else}
          <IconUpload class="h-8 w-8" />

          <h2 class="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
            تصویر ضمیمه
          </h2>

          <p class="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
            درصورت تمایل به پیوست تصویر، اینجا را ضربه بزنید
          </p>
        {/if}
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between px-4">
      <button
        type="button"
        class="btn"
        class:primary={!$isDeviceOnline}
        class:gray={$isDeviceOnline}
        class:ghost={$isDeviceOnline}
        class:opacity-50={$isDeviceOnline}
        on:click|preventDefault={storeOffline}
        use:Ripple
      >
        <span> ذخیره برای ارسال آفلاین </span>
      </button>

      <button
        type="button"
        class="btn icon shrink-0"
        class:primary={$isDeviceOnline}
        class:gray={!$isDeviceOnline}
        class:loading={$sendLoading}
        on:click|preventDefault={onSubmit}
        disabled={!$isDeviceOnline}
        use:Ripple
      >
        <span>ارسال اطلاعات</span>

        {#if $sendLoading}
          <Spinner class="mx-auto h-4 w-4" />
        {:else}
          <IconArrowLeft class="h-4 w-4" />
        {/if}
      </button>
    </div>
  </div>
{/if}
