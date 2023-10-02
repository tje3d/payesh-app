<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import SelectPersonPopup from '/src/components/popup/SelectPersonPopup.svelte'
  import { get } from '/src/di/di.default'
  import type { IKhadem } from '/src/entities/khadem.entity'
  import { removeHash } from '/src/helpers/location.helper'

  const bloc = get(ReportBloc)
  const selectedPerson = bloc.selectedPerson

  function onPersonSelect(e: CustomEvent<IKhadem>) {
    selectedPerson.next(e.detail)
    removeHash('selectPerson')
  }

  onNavigate((nav) => {
    if (!document.startViewTransition) return

    // Ignore initial routing
    if (nav.from?.route.id === '/panel/report') {
      return
    }

    if (!nav.to?.route.id?.startsWith('/panel/report')) {
      return
    }

    return new Promise((fulfil) => {
      document.startViewTransition!(() => new Promise(fulfil as any))
    })
  })
</script>

<slot />

<PopupContainer key="selectPerson" let:close>
  <SelectPersonPopup {close} on:select={onPersonSelect} />
</PopupContainer>

<style>
  :global(:root::view-transition-new(person-info):only-child) {
    animation-duration: 0s;
  }

  :global(.vt-person-info) {
    view-transition-name: person-info;
    contain: layout;
    width: fit-content;
  }
</style>
