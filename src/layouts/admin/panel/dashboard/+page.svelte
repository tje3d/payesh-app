<script lang="ts">
  import * as echarts from 'echarts'
  import { combineLatest, delay, pairwise, startWith, switchMap } from 'rxjs'
  import { onDestroy } from 'svelte'
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import { DataBloc } from '/src/bloc/data.bloc'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import MetaTitle from '/src/components/meta-title.svelte'
  import { di } from '/src/di/di.default'
  import { onMount$, unDestroy } from '/src/helpers/svelte.helper'

  const statOverview = di(DataBloc).inspectStatOverview.request
  const reportDetails = di(DataBloc).reportDetails.request
  const resize = di(DataBloc).resize
  const isDark = di(ThemeBloc).isDark
  const isMobile = di(DataBloc).isMobile

  let chartTarget: HTMLDivElement | undefined
  let theChart: echarts.ECharts | undefined

  const start = onMount$.pipe(
    switchMap(() =>
      isDark.pipe(startWith(undefined), pairwise()).pipe(
        switchMap(([prev, next]) => {
          theChart?.dispose()
          theChart = undefined

          return combineLatest([reportDetails, resize.pipe(startWith(true))])
        }),
      ),
    ),
  )

  // Make sure transitions ends
  unDestroy(resize.pipe(delay(500)), () => {
    theChart?.resize()
  })

  unDestroy(start, ([result]) => {
    if (!result) {
      return
    }

    if (!theChart) {
      theChart = echarts.init(chartTarget, $isDark ? 'dark' : undefined)
    }

    theChart.setOption({
      title: {
        text: 'گزارش براساس گزینه‌ها',
        right: 0,
        show: !$isMobile,
      },
      textStyle: {
        fontFamily: 'VazirFA',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: result.map((item) => item.title),
      },
      series: [
        {
          name: 'ندارد',
          type: 'bar',
          data: result.map((item) => item.true),
        },
        {
          name: 'دارد',
          type: 'bar',
          data: result.map((item) => item.false),
        },
      ],
    })
  })

  onDestroy(() => {
    theChart?.dispose()
  })
</script>

<MetaTitle titles="داشبورد" />

<div class="flex flex-col gap-6 py-6">
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <div
      class="flex flex-col items-center gap-4 rounded-2xl bg-light-2 p-6 shadow-sm dark:bg-dark-2"
    >
      <div class="w-full font-bold">گزارشات امروز</div>

      <div class="text-center font-bold text-green-500">
        <div class="-mb-2 text-6xl">{$statOverview?.today || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex items-center justify-center gap-2 opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="h-3 w-3" />
      </a>
    </div>

    <div
      class="flex flex-col items-center gap-4 rounded-2xl bg-light-2 p-6 shadow-sm dark:bg-dark-2"
    >
      <div class="w-full font-bold">گزارشات دیروز</div>

      <div class="text-center font-bold text-orange-500">
        <div class="-mb-2 text-6xl">{$statOverview?.yesterday || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex items-center justify-center gap-2 opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="h-3 w-3" />
      </a>
    </div>

    <div
      class="flex flex-col items-center gap-4 rounded-2xl bg-light-2 p-6 shadow-sm dark:bg-dark-2"
    >
      <div class="w-full font-bold">گزارشات این هفته</div>

      <div class="text-center font-bold text-red-500">
        <div class="-mb-2 text-6xl">{$statOverview?.last_week || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex items-center justify-center gap-2 opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="h-3 w-3" />
      </a>
    </div>

    <div
      class="flex flex-col items-center gap-4 rounded-2xl bg-light-2 p-6 shadow-sm dark:bg-dark-2"
    >
      <div class="w-full font-bold">گزارشات این ماه</div>

      <div class="text-center font-bold text-blue-500">
        <div class="-mb-2 text-6xl">{$statOverview?.last_month || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex items-center justify-center gap-2 opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="h-4 w-4" />
      </a>
    </div>
  </div>

  <div>
    <div class="rounded-2xl bg-light-2 p-6 shadow-sm dark:bg-dark-2" dir="ltr">
      <div bind:this={chartTarget} style="width: 100%; height: 500px;" />
    </div>
  </div>
</div>
