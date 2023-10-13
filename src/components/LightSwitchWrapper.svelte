<script lang="ts">
  import { BehaviorSubject } from 'rxjs'
  import { ThemeBloc } from '/src/bloc/theme.bloc'
  import { di } from '/src/di/di.default'

  const onClick = new BehaviorSubject<MouseEvent | null>(null)

  function toggleMode(event: PointerEvent | MouseEvent) {
    document.documentElement.classList.add('theme-transition')
    onClick.next(event)

    requestAnimationFrame(() => {
      startViewTransition()
      di(ThemeBloc).toggle()

      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transition')
      })
    })
  }

  async function startViewTransition() {
    if (!document.startViewTransition) {
      return
    }

    const transition = document.startViewTransition(() => new Promise((resolve) => resolve(true)))

    await transition.ready

    const lastClick = onClick.value

    // Get the click position, or fallback to the middle of the screen
    const x = lastClick?.clientX ?? innerWidth / 2
    const y = lastClick?.clientY ?? innerHeight / 2
    // Get the distance to the furthest corner
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // Animate the root's new view
    document.documentElement.animate(
      {
        clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 400,
        easing: 'ease-out',
        // Specify which pseudo-element to animate
        pseudoElement: '::view-transition-new(root)',
      },
    )

    // animateFromMiddle(transition)

    await transition.updateCallbackDone
  }
</script>

<slot {toggleMode} />
