<script lang="ts">
  import * as echarts from 'echarts'
  import { combineLatest, pairwise, startWith, switchMap } from 'rxjs'
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
          name: 'دارد',
          type: 'bar',
          data: result.map((item) => item.true),
        },
        {
          name: 'ندارد',
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
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-2xl shadow-sm p-6 flex flex-col gap-4 items-center"
    >
      <div class="font-bold w-full">گزارشات امروز</div>

      <div class="text-green-500 font-bold text-center">
        <div class="text-6xl -mb-2">{$statOverview?.today || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex gap-2 justify-center items-center opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="w-3 h-3" />
      </a>
    </div>

    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-2xl shadow-sm p-6 flex flex-col gap-4 items-center"
    >
      <div class="font-bold w-full">گزارشات دیروز</div>

      <div class="text-orange-500 font-bold text-center">
        <div class="text-6xl -mb-2">{$statOverview?.yesterday || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex gap-2 justify-center items-center opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="w-3 h-3" />
      </a>
    </div>

    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-2xl shadow-sm p-6 flex flex-col gap-4 items-center"
    >
      <div class="font-bold w-full">گزارشات این هفته</div>

      <div class="text-red-500 font-bold text-center">
        <div class="text-6xl -mb-2">{$statOverview?.last_week || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex gap-2 justify-center items-center opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="w-3 h-3" />
      </a>
    </div>

    <div
      class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-2xl shadow-sm p-6 flex flex-col gap-4 items-center"
    >
      <div class="font-bold w-full">گزارشات این ماه</div>

      <div class="text-blue-500 font-bold text-center">
        <div class="text-6xl -mb-2">{$statOverview?.last_month || 0}</div>
        <div>گزارش</div>
      </div>

      <a class="btn ghost gray flex gap-2 justify-center items-center opacity-75" href="#">
        مشاهده گزارشات
        <IconArrowLeft class="w-4 h-4" />
      </a>
    </div>
  </div>

  <div>
    <div class="bg-light-surface-2 dark:bg-dark-surface-2 rounded-2xl shadow-sm p-6" dir="ltr">
      <div bind:this={chartTarget} style="width: 100%; height: 500px;" />
    </div>
  </div>
</div>
