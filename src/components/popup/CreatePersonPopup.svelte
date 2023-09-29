<script lang="ts">
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import Spinner from '/src/components/Spinner.svelte'
  import InputText from '/src/components/form/input-text.svelte'
  import { PersonCreateBloc } from '/src/bloc/person.create.bloc'
  import { onDestroy } from 'svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { unDestroy } from '/src/helpers/svelte.helper'
  import WarningAlert from '/src/components/alerts/WarningAlert.svelte'
  import { di } from '/src/di/di.default'
  import { ToastBloc } from '/src/bloc/toast.bloc'

  export let close: () => void

  const bloc = new PersonCreateBloc()

  const loading = bloc.createLoading
  const messageError = bloc.messageError
  const formError = bloc.formError
  const create = bloc.create

  let form: typeof PersonCreateBloc.createSchema._type = {
    first_name: '',
    last_name: '',
    code: '',
  }

  function submit(this: HTMLFormElement) {
    if ($loading) {
      return
    }

    bloc.createSubmit.next(form)
  }

  unDestroy(create, (result) => {
    if (result) {
      di(ToastBloc).success(result)
      close()
    }
  })

  unDestroy(create)
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
