<script lang="ts">
  import { goto } from '$app/navigation'
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
  const send = bloc.send.request
  const sendLoading = bloc.send.loading
  const step = bloc.step

  const organsLoading = dataBloc.organs.loading
  const organs = dataBloc.organs.request

  function nextStep() {
    goto('/panel/report/step2')
  }

  onMount(() => {
    bloc.step.next(1)
  })

  onDestroy(() => {
    bloc.send.error.next(undefined)
  })
</script>

<MetaTitle titles={['ثبت گزارش', 'انتخاب خادم']} />

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
            <div class="flex items-center gap-3 vt-person-info">
              <div>
                <img class="rounded-full w-10 h-10" alt="تصویر" src="https://placehold.co/80x80" />
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
      on:click|preventDefault={nextStep}
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
