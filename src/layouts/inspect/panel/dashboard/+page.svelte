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
</script>

<MetaTitle titles="داشبورد" />

<div class="relative pb-5">
  <img
    class="absolute top-0 right-0 bottom-0 left-0 object-cover w-full h-full bg-black"
    src="/images/haram.jpg"
    alt="تصویر"
  />

  <div class="absolute top-4 right-4 text-white z-10">
    <LightSwitch />
  </div>

  <div class="absolute top-4 left-4 text-white z-10">
    <button use:Ripple type="button" class="btn gray circle ghost circle" on:click={toggleLayout}>
      <div class="swap swap-rotate">
        <input type="checkbox" checked={$layout === 'inspect'} />

        <Mobile class="swap-on fill-current w-6 h-6" />

        <Pc class="swap-off fill-current w-6 h-6" />
      </div>
    </button>
  </div>

  <div class="grid place-content-center pt-8 pb-10 relative text-white">
    <div class="flex flex-col items-center gap-2">
      <div class="w-24 h-24">
        <img
          src="/images/logo.png"
          class="invert max-w-full max-h-full mx-auto"
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
    class="bg-light-surface dark:bg-dark-surface w-full h-10 rounded-t-xl absolute left-0 right-0 bottom-0 -mb-7"
  />
</div>

<div class="relative z-10 h-20 -mt-10 flex gap-4 px-6">
  <div
    class="h-20 bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg flex-auto flex flex-col items-center justify-center gap-1 shadow-lg"
  >
    {#if $inspectStatLoading && !$inspectStat}
      <Spinner class="w-5 h-5 mb-2" />
    {:else if $inspectStat}
      <div class="font-bold text-xl text-teal-500">{$inspectStat.today}</div>
    {/if}
    <div class="text-xs text-gray-500 dark:text-gray-400">گزارشات امروز</div>
  </div>

  <div
    class="h-20 bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg flex-auto flex flex-col items-center justify-center gap-1 shadow-lg"
  >
    {#if $inspectStatLoading && !$inspectStat}
      <Spinner class="w-5 h-5 mb-2" />
    {:else if $inspectStat}
      <div class="font-bold text-xl text-teal-500">{$inspectStat.last_month}</div>
    {/if}
    <div class="text-xs text-gray-500 dark:text-gray-400">گزارشات این ماه</div>
  </div>
</div>

<div class="relative px-6 pt-4 flex flex-col gap-4 pb-6">
  {#if $offlineCount}
    <div
      class="btn gray bg-white text-black dark:text-white dark:bg-[#30334e] dark:text-white py-6 icon justify-between shadow-lg shadow-orange-500/10 flex-col"
      role="button"
      tabindex={0}
      use:Ripple
      on:click={flushOffline}
    >
      <!-- <div class="me-2"><IconSync class="w-6 h-6" /></div> -->
      <div class="flex flex-col gap-2 flex-auto text-center">
        <div class="text-lg text-teal-500">ارسال گزارشات آفلاین</div>
        <div class="text-xs text-gray-400 font-normal">
          جهت ارسال گزارشات ذخیره شده به سرور کلیک کنید
        </div>
      </div>

      {#if !$flushLoading}
        <div class="chip ghost orange">{$offlineCount} گزارش</div>
      {:else}
        <div class="chip ghost orange flex items-center gap-2">
          <Spinner class="w-3 h-3 mx-auto" />
          <span>در حال ارسال گزارشات به سرور...</span>
        </div>
      {/if}

      {#if !$isDeviceOnline}
        <div class="chip orange">دستگاه به شبکه متصل نمیباشد</div>
      {/if}
    </div>
  {/if}

  <a
    class="btn gray bg-light-surface-2 dark:bg-dark-surface-2 py-6 icon justify-between shadow-lg"
    href="/panel/report"
    use:Ripple
  >
    <div class="me-2"><IconAdd class="w-6 h-6" /></div>
    <div class="flex flex-col gap-2 flex-auto">
      <div>ثبت گزارش جدید</div>
      <div class="text-xs text-gray-400 font-normal">جهت ثبت گزارش جدید اینجا کلیک کنید</div>
    </div>
    <IconLeft class="w-4 h-4" />
  </a>
  <div
    class="btn gray bg-light-surface-2 dark:bg-dark-surface-2 py-6 icon justify-between shadow-lg"
    role="button"
    tabindex={0}
    use:Ripple
  >
    <div class="me-2"><IconDocs class="w-6 h-6" /></div>
    <div class="flex flex-col gap-2 flex-auto">
      <div>گزارشات پیشین</div>
      <div class="text-xs text-gray-400 font-normal">مشاهده یا ویرایش گزارشات پیشین</div>
    </div>
    <IconLeft class="w-4 h-4" />
  </div>
  <div
    class="btn gray bg-light-surface-2 dark:bg-dark-surface-2 py-6 icon justify-between shadow-lg"
    role="button"
    tabindex={0}
    on:click={() => addHash('newPerson')}
    use:Ripple
  >
    <div class="me-2"><IconUserPlus class="w-6 h-6" /></div>
    <div class="flex flex-col gap-2 flex-auto">
      <div>ثبت اطلاعات خادم جدید</div>
      <div class="text-xs text-gray-400 font-normal">ایجاد خادم جدید درصورت عدم وجود</div>
    </div>
    <IconLeft class="w-4 h-4" />
  </div>
</div>

<PopupContainer key="newPerson" let:close>
  <CreatePersonPopup {close} />
</PopupContainer>
