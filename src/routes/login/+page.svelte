<script lang="ts">
  import { goto } from '$app/navigation'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { LoginBloc } from '/src/bloc/login.bloc'
  import LightSwitch from '/src/components/LightSwitch.svelte'
  import Spinner from '/src/components/Spinner.svelte'
  import WarningAlert from '/src/components/alerts/WarningAlert.svelte'
  import Checkbox from '/src/components/form/checkbox.svelte'
  import InputText from '/src/components/form/input-text.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di, get } from '/src/di/di.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const bloc = new LoginBloc()
  const isLoggedIn = di(AuthBloc).isLoggedIn

  const login = bloc.login
  const loading = login.loading
  const messageError = login.messageError
  const formError = login.formError
  const request = login.request

  let form: typeof login.schema._type = {
    rememberMe: true,
    username: '',
    password: '',
  }

  async function onSubmit(this: HTMLFormElement) {
    if ($loading) {
      return
    }

    login.submit.next(form)
  }

  unDestroy(request)

  unDestroy(isLoggedIn, (login) => {
    if (login) {
      goto('/panel/dashboard')
    }
  })
</script>

<MetaTitle titles="ورود" />

<div class="mx-auto flex h-full items-center justify-center px-4 sm:px-0" dir="rtl">
  <div class="m-auto flex flex-col items-center space-y-10 text-center">
    <div
      class="relative min-w-[300px] overflow-hidden rounded-lg border border-blue-500 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-[#30334e]"
    >
      <header class="text-start">
        <div class="flex items-center justify-between pb-2">
          <h1 class="text-lg font-bold text-primary">
            ورود به سامانه {import.meta.env.VITE_APP_NAME}
          </h1>
          <div dir="ltr"><LightSwitch /></div>
        </div>

        <p class="text-sm text-gray-500">
          در صورتی که قبلا ثبت نام کرده اید، لطفا نام کاربری و رمزعبور خود را وارد نمایید
        </p>
      </header>

      <section class="pt-8 text-start">
        <form class="flex flex-col space-y-4" use:focusTrap on:submit|preventDefault={onSubmit}>
          <div class="w-full">
            <InputText
              label="نام کاربری"
              autocomplete="username"
              focus={true}
              bind:value={form.username}
              error={$formError.username}
              readonly={$loading}
            />
          </div>

          <div class="w-full">
            <InputText
              label="رمزعبور"
              autocomplete="current-password"
              password={true}
              bind:value={form.password}
              error={$formError.password}
              readonly={$loading}
            />
          </div>

          <div class="flex flex-wrap items-center justify-between text-center" dir="ltr">
            <!-- <a href="/register" class="text-sm underline">ثبت نام نکرده اید؟</a> -->
            <div />

            <label class="inline-flex items-center">
              <div class="text-sm">مرا به خاطر بسپار</div>

              <Checkbox bind:checked={form.rememberMe} value={1} />
            </label>
          </div>

          <button
            type="submit"
            class="btn primary"
            class:loading={$loading}
            disabled={$loading}
            use:Ripple
          >
            <span>ورود</span>

            {#if $loading}
              <Spinner class="mx-auto h-4 w-4" />
            {/if}
          </button>
        </form>
      </section>
    </div>

    {#if $messageError}
      <WarningAlert closable={true}>
        <div slot="title">خطا</div>
        <div>{$messageError}</div>
      </WarningAlert>
    {/if}

    <div class="text-xs opacity-40">تمام حقوق این وبگاه متعلق به آستان قدس رضوی است</div>
  </div>
</div>
