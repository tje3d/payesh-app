export default function scrollHorizontal(
  node: HTMLElement,
  enable: boolean = true,
) {
  let isDown = false
  let startX: number
  let scrollLeft: number

  function mouseDown(e: MouseEvent) {
    isDown = true
    node.classList.add('active')
    startX = e.pageX - node.offsetLeft
    scrollLeft = node.scrollLeft
  }

  function mouseLeave() {
    isDown = false
  }

  function mouseUp() {
    isDown = false
  }

  function mouseMove(e: MouseEvent) {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - node.offsetLeft
    const walk = x - startX
    node.scrollLeft = scrollLeft - walk
  }

  if (enable) {
    node.addEventListener('mousedown', mouseDown)
    node.addEventListener('mouseleave', mouseLeave)
    node.addEventListener('mouseup', mouseUp)
    node.addEventListener('mousemove', mouseMove)
  }

  return {
    destroy() {
      node.removeEventListener('mousedown', mouseDown)
      node.removeEventListener('mouseleave', mouseLeave)
      node.removeEventListener('mouseup', mouseUp)
      node.removeEventListener('mousemove', mouseMove)
    },
  }
}
