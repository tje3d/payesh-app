import type { Subscription } from 'rxjs'
import type { Unsubscriber } from 'svelte/store'

export function toUnsubscriber(sub: Subscription): Unsubscriber {
  return () => {
    sub.unsubscribe()
  }
}

export function getMobileOperatingSystem() {
  // @ts-ignore
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone'
  }

  if (/android/i.test(userAgent)) {
    return 'Android'
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  // @ts-ignore
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS'
  }
}
