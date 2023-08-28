<script lang="ts">
  import focus from '/src/actions/focus.action'
  import { focusTrap } from '/src/actions/focusTrap.action'
  import Ripple from '/src/actions/ripple.action'
  import { SvelteSubject } from '/src/bloc/bloc.default'
  import InputText from '/src/components/form/input-text.svelte'
  import LightSwitch from '/src/components/light-switch.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'

  const loading = new SvelteSubject<boolean>(false)

  async function onSubmit() {
    loading.next(true)

    // goto('/panel');

    loading.next(false)
  }

  let rememberMe: boolean = true
  let username: string = ''
  let password: string = ''
</script>

<MetaTitle titles="ورود" />

<div class="h-full mx-auto flex justify-center items-center" dir="rtl">
  <div class="space-y-10 text-center flex flex-col items-center">
    <div
      class="p-6 shadow-xl relative overflow-hidden bg-white dark:bg-[#30334e] rounded-lg min-w-[300px]"
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
        <form
          action=""
          class="flex flex-col space-y-4"
          use:focusTrap
          on:submit|preventDefault={onSubmit}
        >
          <div class="w-full">
            <InputText label="نام کاربری" focus={true} bind:value={username} />
          </div>

          <div class="w-full">
            <InputText label="رمزعبور" password={true} bind:value={password} />
          </div>

          <div class="flex flex-wrap text-center justify-between items-center" dir="ltr">
            <a href="/register" class="text-sm underline">ثبت نام نکرده اید؟</a>

            <label class="inline-flex items-center">
              <div class="text-sm">مرا به خاطر بسپار</div>

              <label
                class="relative flex cursor-pointer items-center rounded-full p-3"
                for="checkbox"
                use:Ripple
              >
                <input
                  type="checkbox"
                  class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                  id="checkbox"
                  checked
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
            class="middle none center rounded-lg bg-blue-500 py-3 px-6 text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            use:Ripple
          >
            ورود
          </button>

          {#if $loading}
            <div class="absolute left-0 bottom-0 right-0">
              <!-- <ProgressBar meter="bg-primary-500" /> -->
            </div>
          {/if}
        </form>
      </section>
    </div>

    <div class="text-xs opacity-40">تمام حقوق این وبگاه متعلق به آستان قدس رضوی است</div>
  </div>
</div>
