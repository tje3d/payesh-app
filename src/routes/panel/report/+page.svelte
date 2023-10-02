<script lang="ts">
  import { goto } from '$app/navigation'
  import { ReportBloc } from '/src/bloc/report.bloc'
  import { get } from '/src/di/di.default'

  const bloc = get(ReportBloc)

  goto('/panel/report/step' + bloc.step.getValue())
</script>
