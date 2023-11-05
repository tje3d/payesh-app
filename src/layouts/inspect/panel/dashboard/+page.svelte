<script lang="ts">
  import { map, pairwise } from 'rxjs'
  import IconLeft from '~icons/heroicons/arrow-left'
  import IconDocs from '~icons/heroicons/clipboard-document'
  import Pc from '~icons/heroicons/computer-desktop'
  import Mobile from '~icons/heroicons/device-phone-mobile'
  import IconAdd from '~icons/heroicons/document-plus'
  import IconUserPlus from '~icons/heroicons/user-plus'
  import Ripple from '/src/actions/ripple.action'
  import { AuthBloc } from '/src/bloc/auth.bloc'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { OfflineReportBloc } from '/src/bloc/offline.report.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { ToastBloc } from '/src/bloc/toast.bloc'
  import LightSwitch from '/src/components/LightSwitch.svelte'
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import Spinner from '/src/components/Spinner.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import CreatePersonPopup from '/src/components/popup/CreatePersonPopup.svelte'
  import { di } from '/src/di/di.default'
  import { addHash } from '/src/helpers/location.helper'
  import { isDeviceOnline } from '/src/helpers/observable.helper'
  import { unDestroy } from '/src/helpers/svelte.helper'

  const layout = di(ThemeBloc).layout
  const displayName = di(AuthBloc).displayName
  const offlineCount = di(OfflineReportBloc).count
  const flushError = di(OfflineReportBloc).error
  const flushLoading = di(OfflineReportBloc).flushLoading
  const flushEnd = offlineCount.pipe(
    pairwise(),
    map(([prev, next]) => {
      if (next === 0 && prev !== 0) {
        return true
      }

      return false
    }),
  )
  const inspectStatLoading = di(DataBloc).inspectStatOverview.loading
  const inspectStat = di(DataBloc).inspectStatOverview.request

  function flushOffline() {
    if (!$isDeviceOnline || $flushLoading) {
      return
    }

    di(OfflineReportBloc).flushSubmit.next(true)
  }

  function toggleLayout() {
    di(ThemeBloc).toggleLayout()
  }

  unDestroy(flushEnd, (status) => {
    if (status) {
      di(ToastBloc).success('تمامی گزارشات ارسال و ثبت شدند')
    }
  })

  unDestroy(flushError, (err) => {
    if (err) {
      di(ToastBloc).error(err)
    }
  })

  unDestroy(di(OfflineReportBloc).flush)
</script>

<MetaTitle titles="داشبورد" />

<div class="relative pb-5">
  <img
    class="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black object-cover"
    src="/images/haram.jpg"
    alt="تصویر"
  />

  <div class="absolute right-4 top-4 z-10 text-white">
    <LightSwitch />
  </div>

  <div class="absolute left-4 top-4 z-10 text-white">
    <button use:Ripple type="button" class="btn gray circle ghost circle" on:click={toggleLayout}>
      <div class="swap swap-rotate">
        <input type="checkbox" checked={$layout === 'inspect'} />

        <Mobile class="swap-on h-6 w-6 fill-current" />

        <Pc class="swap-off h-6 w-6 fill-current" />
      </div>
    </button>
  </div>

  <div class="relative grid place-content-center pb-10 pt-8 text-white">
    <div class="flex flex-col items-center gap-2">
      <div class="h-24 w-24">
        <img
          src="/images/logo.png"
          class="mx-auto max-h-full max-w-full invert"
          alt="آستان قدس رضوی"
        />
      </div>

      <div>
        <span class="text-sm">سلام, </span>
        <strong class="font-bold">{$displayName}</strong>
      </div>

      <div class="text-xs">به نرم افزار پایش خدام آستان قدس رضوی خوش آمدید</div>
    </div>
  </div>

  <div
    class="absolute bottom-0 left-0 right-0 -mb-7 h-10 w-full rounded-t-xl bg-light-surface dark:bg-dark-surface"
  />
</div>

<div class="relative z-10 -mt-10 flex h-20 gap-4 px-4">
  <div
    class="flex h-20 flex-auto flex-col items-center justify-center gap-1 rounded-2xl bg-light-surface-2 shadow-sm dark:bg-dark-surface-2"
  >
    {#if $inspectStatLoading && !$inspectStat}
      <Spinner class="mb-2 h-5 w-5" />
    {:else if $inspectStat}
      <div class="text-xl font-bold text-teal-500">{$inspectStat.today}</div>
    {/if}
    <div class="text-xs text-gray-500 dark:text-gray-400">گزارشات امروز</div>
  </div>

  <div
    class="flex h-20 flex-auto flex-col items-center justify-center gap-1 rounded-2xl bg-light-surface-2 shadow-sm dark:bg-dark-surface-2"
  >
    {#if $inspectStatLoading && !$inspectStat}
      <Spinner class="mb-2 h-5 w-5" />
    {:else if $inspectStat}
      <div class="text-xl font-bold text-teal-500">{$inspectStat.last_month}</div>
    {/if}
    <div class="text-xs text-gray-500 dark:text-gray-400">گزارشات این ماه</div>
  </div>
</div>

<div class="relative flex flex-col gap-4 px-4 pb-6 pt-4">
  {#if $offlineCount}
    <div
      class="flex flex-col items-center gap-4 rounded-2xl bg-light-surface-2 p-6 text-sm font-bold shadow-sm dark:bg-dark-surface-2"
      role="button"
      tabindex={0}
      use:Ripple
      on:click={flushOffline}
    >
      <!-- <div class="me-2"><IconSync class="w-6 h-6" /></div> -->
      <div class="flex flex-auto flex-col gap-2 text-center">
        <div class="text-lg text-teal-500">ارسال گزارشات آفلاین</div>
        <div class="text-xs font-normal text-gray-400">
          جهت ارسال گزارشات ذخیره شده به سرور کلیک کنید
        </div>
      </div>

      {#if !$flushLoading}
        <div class="chip ghost orange">{$offlineCount} گزارش</div>
      {:else}
        <div class="chip ghost orange flex items-center gap-2">
          <Spinner class="mx-auto h-3 w-3" />
          <span>در حال ارسال گزارشات به سرور...</span>
        </div>
      {/if}

      {#if !$isDeviceOnline}
        <div class="chip orange">دستگاه به شبکه متصل نمیباشد</div>
      {/if}
    </div>
  {/if}

  <a
    class="flex items-center gap-4 rounded-2xl bg-light-surface-2 p-6 text-sm font-bold shadow-sm dark:bg-dark-surface-2"
    href="/panel/report"
    use:Ripple
  >
    <div class="me-2"><IconAdd class="h-6 w-6" /></div>
    <div class="flex flex-auto flex-col gap-2">
      <div>ثبت گزارش جدید</div>
      <div class="text-xs font-normal text-gray-400 dark:text-gray-600">
        جهت ثبت گزارش جدید اینجا کلیک کنید
      </div>
    </div>
    <IconLeft class="h-4 w-4" />
  </a>

  <div
    class="flex items-center gap-4 rounded-2xl bg-light-surface-2 p-6 text-sm font-bold shadow-sm dark:bg-dark-surface-2"
    role="button"
    tabindex={0}
    use:Ripple
  >
    <div class="me-2"><IconDocs class="h-6 w-6" /></div>
    <div class="flex flex-auto flex-col gap-2">
      <div>گزارشات پیشین</div>
      <div class="text-xs font-normal text-gray-400 dark:text-gray-600">
        مشاهده یا ویرایش گزارشات پیشین
      </div>
    </div>
    <IconLeft class="h-4 w-4" />
  </div>

  <div
    class="flex items-center gap-4 rounded-2xl bg-light-surface-2 p-6 text-sm font-bold shadow-sm dark:bg-dark-surface-2"
    role="button"
    tabindex={0}
    on:click={() => addHash('newPerson')}
    use:Ripple
  >
    <div class="me-2"><IconUserPlus class="h-6 w-6" /></div>
    <div class="flex flex-auto flex-col gap-2">
      <div>ثبت اطلاعات خادم جدید</div>
      <div class="text-xs font-normal text-gray-400 dark:text-gray-600">
        ایجاد خادم جدید درصورت عدم وجود
      </div>
    </div>
    <IconLeft class="h-4 w-4" />
  </div>
</div>

<PopupContainer key="newPerson" let:close>
  <CreatePersonPopup {close} />
</PopupContainer>
