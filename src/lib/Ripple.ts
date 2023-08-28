export class Ripple {
  x = 0
  y = 0
  z = 0

  findFurthestPoint(
    clickPointX: any,
    elementWidth: any,
    offsetX: any,
    clickPointY: any,
    elementHeight: any,
    offsetY: any,
  ) {
    this.x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth
    this.y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight
    this.z = Math.hypot(this.x - (clickPointX - offsetX), this.y - (clickPointY - offsetY))

    return this.z
  }

  appyStyles(element: any, color: any, rect: any, radius: any, event: any) {
    element.classList.add('ripple')
    element.style.backgroundColor = color === 'dark' ? 'rgba(0,0,0, 0.2)' : 'rgba(255,255,255, 0.3)'
    element.style.borderRadius = '50%'
    element.style.pointerEvents = 'none'
    element.style.position = 'absolute'
    element.style.left = event.clientX - rect.left - radius + 'px'
    element.style.top = event.clientY - rect.top - radius + 'px'
    element.style.width = element.style.height = radius * 2 + 'px'
  }

  applyAnimation(element: HTMLElement) {
    element.animate(
      [
        {
          transform: 'scale(0)',
          opacity: 1,
        },
        {
          transform: 'scale(1.5)',
          opacity: 0,
        },
      ],
      {
        duration: 500,
        easing: 'linear',
        fill: 'forwards',
      },
    )
  }

  create(event: any, color: any) {
    const element = event.currentTarget

    element.style.position = 'relative'
    element.style.overflow = 'hidden'

    const rect = element.getBoundingClientRect()

    const radius = this.findFurthestPoint(
      event.clientX,
      element.offsetWidth,
      rect.left,
      event.clientY,
      element.offsetHeight,
      rect.top,
    )

    const circle = document.createElement('span')

    this.appyStyles(circle, color, rect, radius, event)
    this.applyAnimation(circle)

    element.appendChild(circle)

    setTimeout(() => circle.remove(), 500)
  }
}
