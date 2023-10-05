<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import { PersonCreateBloc } from '/src/bloc/person.create.bloc'
  import { ToastBloc } from '/src/bloc/toast.bloc'
  import Spinner from '/src/components/Spinner.svelte'
  import WarningAlert from '/src/components/alerts/WarningAlert.svelte'
  import InputText from '/src/components/form/input-text.svelte'
  import { di } from '/src/di/di.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  export let close: () => void

  const dispatcher = createEventDispatcher()
  const bloc = new PersonCreateBloc()

  const loading = bloc.create.loading
  const messageError = bloc.create.messageError
  const formError = bloc.create.formError

  let form: typeof bloc.create.schema._type = {
    first_name: '',
    last_name: '',
    code: '',
  }

  function submit(this: HTMLFormElement) {
    if ($loading) {
      return
    }

    bloc.create.submit.next(form)
  }

  unDestroy(bloc.create.request, (result) => {
    if (result) {
      di(ToastBloc).success(result.message)
      dispatcher('created', result.khadem)
      close()
    }
  })
</script>

<form on:submit|preventDefault={submit}>
  <div class="px-4 py-2 flex items-center bg-light-surface-2 dark:bg-dark-surface-2 gap-2">
    <div class="flex-auto">ثبت اطلاعات خادم جدید</div>

    <button type="button" class="btn circle ghost gray" on:click={close}>
      <IconArrowLeft class="w-5 h-5" />
    </button>
  </div>

  <div class="flex flex-col gap-4 px-4 pt-4">
    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 shadow-md rounded-lg p-4 flex flex-col gap-4"
    >
      <div>
        <InputText
          label="نام"
          focus={true}
          bind:value={form.first_name}
          error={$formError.first_name}
          readonly={$loading}
        />
      </div>
      <div>
        <InputText
          label="نام خانوادگی"
          bind:value={form.last_name}
          error={$formError.last_name}
          readonly={$loading}
        />
      </div>
      <div>
        <InputText
          label="کد خدمتی"
          onlyNumber={true}
          bind:value={form.code}
          error={$formError.code}
          readonly={$loading}
        />
      </div>
    </div>

    <div>
      <button type="submit" class="btn indigo icon shrink-0" class:loading={$loading}>
        <span>ارسال اطلاعات</span>

        {#if $loading}
          <Spinner class="w-4 h-4 mx-auto" />
        {:else}
          <IconArrowLeft class="w-4 h-4" />
        {/if}
      </button>
    </div>

    {#if $messageError}
      <WarningAlert closable={true}>
        <div slot="title">خطا</div>
        <div>{$messageError}</div>
      </WarningAlert>
    {/if}
  </div>
</form>
