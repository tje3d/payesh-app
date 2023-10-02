<script lang="ts">
  import { goto } from '$app/navigation'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import { get } from '/src/di/di.default'

  const bloc = get(ReportBloc)

  goto('/panel/report/step' + bloc.step.getValue())
</script>

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
