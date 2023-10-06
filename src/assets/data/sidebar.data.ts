import IconCog from '~icons/heroicons/cog'
import IconTv from '~icons/heroicons/tv'

export interface SidebarItem {
  text: string
  href?: string
  icon?: any
  label?: string
  matchPattern?: RegExp
  childs?: SidebarItem[]
  roles?: number[]
}

export const sidebarData: SidebarItem[] = [
  // ─── Dashboard ───────────────────────────────────────────────────────

  {
    text: 'پنل کاربری',
    roles: [1],
  },
  {
    text: 'داشبورد',
    icon: IconTv,
    href: '/panel/dashboard',
    matchPattern: new RegExp(/\/panel\/dashboard\/.*/),
    roles: [1],
  },

  // ─── Inspector ───────────────────────────────────────────────────────

  {
    text: 'گزارش دهنده',
  },
  {
    text: 'ثبت گزارش جدید',
    icon: IconTv,
    href: '/panel/report',
    matchPattern: new RegExp(/\/panel\/report\/.*/),
  },

  // ─── Profile ─────────────────────────────────────────────────────────

  {
    text: 'پروفایل',
  },
  {
    text: 'ویرایش مشخصات',
    icon: IconCog,
    href: '/panel/profile',
  },
]
