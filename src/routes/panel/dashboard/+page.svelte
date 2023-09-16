<script lang="ts">
  import IconLeft from '~icons/heroicons/arrow-left'
  import IconSync from '~icons/heroicons/arrow-path'
  import IconDocs from '~icons/heroicons/clipboard-document'
  import IconAdd from '~icons/heroicons/document-plus'
  import IconUserPlus from '~icons/heroicons/user-plus'
  import Ripple from '/src/actions/ripple.action'
  import LightSwitch from '/src/components/light-switch.svelte'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di } from '/src/di/di.default'
  import { AuthBloc } from '/src/bloc/auth.bloc'

  const displayName = di(AuthBloc).displayName
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

  <div class="body-bg w-full h-10 rounded-t-xl absolute left-0 right-0 bottom-0 -mb-7" />
</div>

<div class="relative z-10 h-20 -mt-10 flex gap-4 px-6">
  <div
    class="h-20 bg-white dark:bg-[#2f314c] rounded-lg flex-auto flex flex-col items-center justify-center gap-1 shadow-lg"
  >
    <div class="font-bold text-xl text-teal-500">۳</div>
    <div class="text-xs text-gray-500 dark:text-gray-400">گزارشات امروز</div>
  </div>

  <div
    class="h-20 bg-white dark:bg-[#2f314c] rounded-lg flex-auto flex flex-col items-center justify-center gap-1 shadow-lg"
  >
    <div class="font-bold text-xl text-teal-500">۲۳۰</div>
    <div class="text-xs text-gray-500 dark:text-gray-400">کل گزارشات</div>
  </div>
</div>

<div class="relative px-6 pt-6 flex flex-col gap-4 pb-6">
  <a
    class="btn gray bg-white text-black dark:text-white dark:bg-[#30334e] dark:text-white py-6 icon justify-between shadow-lg"
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
    class="btn gray bg-white text-black dark:text-white dark:bg-[#30334e] dark:text-white py-6 icon justify-between shadow-lg"
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
    class="btn gray bg-white text-black dark:text-white dark:bg-[#30334e] dark:text-white py-6 icon justify-between shadow-lg"
    use:Ripple
  >
    <div class="me-2"><IconUserPlus class="w-6 h-6" /></div>
    <div class="flex flex-col gap-2 flex-auto">
      <div>ثبت خادم جدید</div>
      <div class="text-xs text-gray-400 font-normal">ایجاد خادم جدید درصورت عدم وجود</div>
    </div>
    <IconLeft class="w-4 h-4" />
  </div>
  <div
    class="btn gray bg-white text-black dark:text-white dark:bg-[#30334e] dark:text-white py-6 icon justify-between shadow-lg"
    use:Ripple
  >
    <div class="me-2"><IconSync class="w-6 h-6" /></div>
    <div class="flex flex-col gap-2 flex-auto">
      <div>ارسال گزارشات آفلاین</div>
      <div class="text-xs text-gray-400 font-normal">ارسال گزارشات ذخیره شده به سرور</div>
    </div>

    <div class="chip ghost orange">بدون گزارش</div>
    <!-- <div class="chip ghost indigo">۱۰ گزارش</div> -->
  </div>
</div>

<!-- <div class="grid gap-6 p-4">
  <div class="btn indigo py-4 text-base">ثبت گزارش</div>
  <div class="btn indigo py-4 text-base">گزارشات اخیر من</div>
  <div class="btn indigo py-4 text-base">گزارش آفلاین</div>
</div> -->
