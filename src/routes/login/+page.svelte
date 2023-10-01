<script lang="ts">
  import { goto } from '$app/navigation'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { LoginBloc } from '/src/bloc/login.bloc'
  import Spinner from '/src/components/Spinner.svelte'
  import WarningAlert from '/src/components/alerts/WarningAlert.svelte'
  import InputText from '/src/components/form/input-text.svelte'
  import LightSwitch from '/src/components/light-switch.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di, get } from '/src/di/di.default'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const bloc = new LoginBloc()
  const isLoggedIn = di(AuthBloc).isLoggedIn$

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

<div class="h-full mx-auto flex justify-center items-center px-4 sm:px-0" dir="rtl">
  <div class="space-y-10 text-center flex flex-col items-center m-auto">
    <div
      class="p-6 shadow-xl relative overflow-hidden bg-white dark:bg-[#30334e] rounded-lg min-w-[300px] border dark:border-gray-700"
    >
      <header class="text-start">
        <div class="flex justify-between items-center pb-2">
          <h1 class="font-bold text-lg text-gray-800 dark:text-gray-300">
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

          <div class="flex flex-wrap text-center justify-between items-center" dir="ltr">
            <!-- <a href="/register" class="text-sm underline">ثبت نام نکرده اید؟</a> -->
            <div />

            <label class="inline-flex items-center">
              <div class="text-sm">مرا به خاطر بسپار</div>

              <label class="relative flex cursor-pointer items-center rounded-full p-3" use:Ripple>
                <input
                  type="checkbox"
                  class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                  bind:checked={form.rememberMe}
                />
                <div
                  class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </label>
            </label>
          </div>

          <button
            type="submit"
            class="btn blue"
            class:loading={$loading}
            disabled={$loading}
            use:Ripple
          >
            <span>ورود</span>

            {#if $loading}
              <Spinner class="w-4 h-4 mx-auto" />
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
