import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import jalaliday from 'jalaliday'

export default async function init() {
  // ─── Dayjs ───────────────────────────────────────────────────────────

  dayjs.extend(relativeTime)
  dayjs.extend(jalaliday)
  dayjs.extend(duration)
  dayjs.locale('fa')
  // @ts-ignore
  dayjs.calendar('jalali')
}
