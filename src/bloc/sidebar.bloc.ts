import { combineLatest, map } from 'rxjs'
import { sidebarData, type SidebarItem } from '/src/assets/data/sidebar.data'
import { Bloc, SvelteSubject } from '/src/bloc/bloc.default'
import { routeId } from '/src/helpers/observable.helper'

export class SidebarBloc extends Bloc {
  items = new SvelteSubject<SidebarItem[]>(sidebarData)
  activesManual = new SvelteSubject<SidebarItem[]>([])

  activesByRoute = combineLatest([this.items, routeId]).pipe(
    map(([items, routeId]) => {
      if (!routeId) {
        return []
      }

      let output: SidebarItem[] = []

      getActiveItems(output, items, routeId)

      return output
    }),
  )

  actives = combineLatest([this.activesManual, this.activesByRoute]).pipe(
    map(([manual, byRoute]) => {
      let output = manual

      byRoute.forEach((item) => {
        if (output.indexOf(item) === -1) {
          output.push(item)
        }
      })

      return output
    }),
  )

  isOpen = new SvelteSubject<boolean>(true)

  close() {
    this.isOpen.next(false)
  }

  open() {
    this.isOpen.next(true)
  }

  toggle() {
    this.isOpen.next(!this.isOpen.value)
  }

  toggleItem(item: SidebarItem) {
    const forceActives = this.activesManual.value
    const index = forceActives.indexOf(item)

    if (index === -1) {
      forceActives.push(item)
    } else {
      forceActives.splice(index, 1)
    }

    this.activesManual.next(forceActives)
  }

  resetManual() {
    this.activesManual.next([])
  }
}

function getActiveItems(actives: SidebarItem[], items: SidebarItem[], routeId: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    let activated = false

    if (!item.href && !item.matchPattern) {
      continue
    }

    if (item.matchPattern) {
      if (item.matchPattern.test(routeId)) {
        !actives.includes(item) && actives.push(item)
        activated = true
      }
    }

    if (item.href && !activated) {
      if (item.href === routeId) {
        !actives.includes(item) && actives.push(item)
        activated = true
      }
    }

    if (item.childs) {
      getActiveItems(actives, item.childs, routeId)
    }
  }
}
