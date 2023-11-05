export function clickOutside(element: HTMLElement, callbackFunction: () => void) {
  let numberOfClicks = 0

  function onClick(event: Event) {
    if (numberOfClicks === 0) {
      numberOfClicks++
      return
    }

    if (!element.contains(event.target as HTMLElement)) {
      callbackFunction()
    }
  }

  document.body.addEventListener('click', onClick)

  return {
    update(newCallbackFunction: () => void) {
      callbackFunction = newCallbackFunction
    },
    destroy() {
      document.body.removeEventListener('click', onClick)
    },
  }
}
