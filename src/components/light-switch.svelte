<script lang="ts">
  import IconMoon from '~icons/heroicons/moon'
  import IconSun from '~icons/heroicons/sun'
  import Ripple from '/src/actions/ripple.action'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { di } from '/src/di/di.default'

  const isDark = di(ThemeBloc).isDark

  function toggleMode() {
    di(ThemeBloc).toggle()
  }
</script>

<button type="button" class="btn gray circle ghost circle" use:Ripple on:click={toggleMode}>
  <div class="swap swap-rotate">
    <input type="checkbox" checked={$isDark} />

    <IconSun class="swap-off fill-current w-6 h-6" />

    <IconMoon class="swap-on fill-current w-6 h-6" />
  </div>
</button>
