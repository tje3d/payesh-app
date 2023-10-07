import { Observable, Subscription, timer } from 'rxjs'

export function dataURLtoFile(dataurl: string, filename: string): File | undefined {
  const arr = dataurl.split(',')

  if (arr[0] === null) {
    return undefined
  }

  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])

  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export function pickFile(
  accept: string = 'image/*',
  multiple: boolean = false,
  capture?: 'user' | 'environment',
) {
  return new Observable<File[]>((observer) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')

    if (multiple) {
      input.setAttribute('multiple', 'true')
    }

    if (accept) {
      input.setAttribute('accept', accept)
    }

    if (capture) {
      input.setAttribute('capture', capture)
    }

    input.oninput = function () {
      if (multiple) {
        input.files && observer.next(fileListToArray(input.files))
      } else {
        input.files?.[0] && observer.next([input.files?.[0]])
      }

      observer.complete()
    }

    window.addEventListener('focus', onFocus)

    let t: Subscription | undefined

    function onFocus() {
      t = timer(300).subscribe(() => {
        if (observer.closed) {
          return
        }

        observer.complete()

        t!.unsubscribe()
      })
    }

    input.click()

    return () => {
      t?.unsubscribe()
      window.removeEventListener('focus', onFocus)
    }
  })
}

export function fileListToArray(files: FileList) {
  const output = []

  for (const file of files) {
    output.push(file)
  }

  return output
}

export function resizeImage(file: File, width = 800, quality = 0.8, fileType?: string) {
  return new Observable<File>((observer) => {
    const reader = new FileReader()

    reader.onload = function () {
      const image = new Image()

      image.onload = () => {
        const baseOfComparison = image.width >= image.height ? image.width : image.height

        const oc = document.createElement('canvas')
        const octx = oc.getContext('2d')

        if (octx === null) {
          observer.error('an error occured in resizing image')
          return
        }

        if (baseOfComparison <= width) {
          oc.width = image.width
          oc.height = image.height
        } else if (image.width >= image.height) {
          oc.width = width
          oc.height = (oc.width / image.width) * image.height
        } else {
          oc.height = width
          oc.width = (oc.height / image.height) * image.width
        }

        octx.drawImage(image, 0, 0, oc.width, oc.height)

        const fileName = fileType ? `${file.name}.${fileType.toLowerCase()}` : file.name

        const resizedFile = dataURLtoFile(oc.toDataURL(fileType || file.type, quality), fileName)

        if (resizedFile === undefined) {
          observer.error('an error occured in resizing image')
        } else {
          observer.next(resizedFile)
        }

        observer.complete()
      }

      image.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}

export function imagePreview(source: Observable<File | undefined>) {
  return new Observable<string | undefined>((observer) => {
    let url: string | undefined

    const sub = source.subscribe((file) => {
      if (!file) {
        url && URL.revokeObjectURL(url)
        url = undefined
        observer.next(undefined)
        return
      }

      url = URL.createObjectURL(file)

      observer.next(url)
    })

    return () => {
      sub.unsubscribe()
      url && URL.revokeObjectURL(url)
    }
  })
}
