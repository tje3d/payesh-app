<script lang="ts">
  import { goto } from '$app/navigation'
  import { map, switchMap } from 'rxjs'
  import { onDestroy, onMount } from 'svelte'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import IconChevDown from '~icons/heroicons/chevron-down'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import Spinner from '/src/components/Spinner.svelte'
  import Selectdown from '/src/components/form/selectdown.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di, get } from '/src/di/di.default'
  import { addHash } from '/src/helpers/location.helper'

  const bloc = get(ReportBloc)
  const dataBloc = di(DataBloc)

  const management = bloc.management
  const office = bloc.office
  const post = bloc.post
  const selectedPerson = bloc.selectedPerson
  const selectedOptions = bloc.selectedOptions
  const sendLoading = bloc.send.loading

  const organsLoading = dataBloc.organs.loading
  const organs = dataBloc.organs.request

  const officeList = management.pipe(
    switchMap((manage) =>
      organs.pipe(
        map((organs) => {
          if (!manage) {
            return
          }

          return organs?.offices
            .filter((item) => item.management_id === manage)
            .map((item) => ({ value: item.id, title: item.title }))
        }),
      ),
    ),
  )

  const postList = office.pipe(
    switchMap((office) =>
      organs.pipe(
        map((organs) => {
          if (!office) {
            return
          }

          return organs?.posts
            .filter((item) => item.office_id === office)
            .map((item) => ({ value: item.id, title: item.title }))
        }),
      ),
    ),
  )

  function nextStep() {
    goto('/panel/report/step2')
  }

  onMount(() => {
    bloc.step.next(1)
    selectedOptions.next([])
  })

  onDestroy(() => {
    bloc.send.error.next(undefined)
  })
</script>

<MetaTitle titles={['ثبت گزارش', 'انتخاب خادم']} />

<div class="flex flex-col gap-8 py-8" use:focusTrap>
  <div>
    <div class="mb-4 px-4 text-sm font-bold">اطلاعات سازمانی</div>

    <div
      class="mx-4 flex flex-col gap-4 rounded-2xl bg-light-surface-2 p-4 shadow-sm dark:bg-dark-surface-2"
    >
      {#if !$organs && $organsLoading}
        <div class="flex justify-center"><Spinner class="h-6 w-6" /></div>
      {:else}
        <Selectdown
          bind:value={$management}
          label="انتخاب مدیریت"
          options={$organs?.managements.map((item) => ({ value: item.id, title: item.title })) ||
            []}
        />

        <Selectdown bind:value={$office} label="انتخاب اداره" options={$officeList || []} />

        <Selectdown bind:value={$post} label="انتخاب پست" options={$postList || []} />
      {/if}
    </div>
  </div>

  <div class="px-4">
    <div class="mb-4 text-sm font-bold">انتخاب خادم</div>

    <div class="rounded-2xl bg-light-surface-2 p-4 shadow-sm dark:bg-dark-surface-2">
      <button
        type="button"
        class="flex h-14 w-full flex-row items-center rounded-lg border px-3 text-start"
        class:border-gray-200={!$selectedPerson}
        class:dark:border-gray-600={!$selectedPerson}
        class:border-gray-400={!!$selectedPerson}
        use:Ripple
        on:click={() => addHash('selectPerson')}
      >
        {#if $selectedPerson}
          <div class="flex-auto">
            <div class="vt-person-info flex items-center gap-3">
              <div>
                <img class="h-10 w-10 rounded-full" alt="تصویر" src="https://placehold.co/80x80" />
              </div>

              <div>
                <div>
                  {$selectedPerson.first_name}
                  {$selectedPerson.last_name}
                </div>

                <div class="text-xs text-gray-500">
                  {$selectedPerson.code}
                </div>
              </div>
            </div>
          </div>
        {:else}
          <div class="flex-auto text-sm text-gray-500">لطفا یک خادم انتخاب کنید</div>
        {/if}

        <div>
          <IconChevDown class="h-4 w-4" />
        </div>
      </button>
    </div>
  </div>

  <div class="flex items-center justify-between px-4">
    <button
      type="button"
      class="btn primary icon shrink-0"
      disabled={!$selectedPerson || !$management || !$post || !$office}
      on:click|preventDefault={nextStep}
      use:Ripple
    >
      <span>مرحله بعد</span>

      {#if $sendLoading}
        <Spinner class="mx-auto h-4 w-4" />
      {:else}
        <IconArrowLeft class="h-4 w-4" />
      {/if}
    </button>
  </div>
</div>
