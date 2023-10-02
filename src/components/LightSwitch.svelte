<script lang="ts">
  import IconMoon from '~icons/heroicons/moon'
  import IconSun from '~icons/heroicons/sun'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import LightSwitchWrapper from '/src/components/LightSwitchWrapper.svelte'
  import { di } from '/src/di/di.default'

  const isDark = di(ThemeBloc).isDark
</script>

<LightSwitchWrapper let:toggleMode>
  <button type="button" class="btn gray circle ghost circle" on:click={toggleMode}>
    <div class="swap swap-rotate">
      <input type="checkbox" checked={$isDark} />

      <IconSun class="swap-off fill-current w-6 h-6" />

      <IconMoon class="swap-on fill-current w-6 h-6" />
    </div>
  </button>
</LightSwitchWrapper>
