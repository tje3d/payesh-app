<script lang="ts">
  import IconArrow from '~icons/heroicons/arrow-right'
  import Ripple from '/src/actions/ripple.action'

  function back() {
    history.back()
  }
</script>

<main class="grid h-full place-content-center px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-indigo-600">404</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-500 sm:text-5xl">
      صفحه یافت نشد
    </h1>
    <p class="mt-6 text-base leading-7 text-gray-600">
      متأسفیم، ما نتوانستیم صفحه مورد نظر شما را پیدا کنیم.
    </p>
    <div class="mt-10 flex flex-col items-center justify-center gap-x-2 gap-y-4 md:flex-row">
      <a href="#" class="btn indigo ghost icon" use:Ripple on:click|preventDefault={back}>
        <IconArrow class="h-4 w-4" />
        <span>بازگشت به صفحه قبل</span>
      </a>
      <a href="/login" class="btn indigo" use:Ripple>
        <span>بازگشت به صفحه نخست </span>
      </a>
    </div>
  </div>
</main>
