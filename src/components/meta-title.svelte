<script lang="ts">
  import { combineLatest, distinctUntilChanged, map } from 'rxjs';
  import { SvelteSubject } from '/src/bloc/bloc.default';

  export let showDefault: boolean = true;
  export let defaultTitle: string = import.meta.env.VITE_TITLE;
  export let titles: string[] | string = [];

  const showDefault$ = new SvelteSubject(showDefault);
  const defaultTitle$ = new SvelteSubject(defaultTitle);
  const titles$ = new SvelteSubject(titles);

  $: showDefault$.next(showDefault);
  $: defaultTitle$.next(defaultTitle);
  $: titles$.next(titles);

  const title = combineLatest([showDefault$, defaultTitle$, titles$]).pipe(
    map(([showDefault, defaultTitle, titles]) => {
      const output: string[] = [];

      if (showDefault) {
        output.push(defaultTitle);
      }

      titles = Array.isArray(titles) ? titles : [titles];

      return titles
        .concat(output)
        .filter((val) => !!val)
        .join(' • ');
    }),
    distinctUntilChanged(),
  );
</script>

<svelte:head>
  <title>{$title}</title>
</svelte:head>
