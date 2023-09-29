import { HTTPError } from 'ky'
import { map, type Observable } from 'rxjs'
import { ZodError } from 'zod'
import { zodFormat } from '/src/helpers/validator.helper'
import {
  ForbiddenError,
  FormError,
  MessageError,
  ServerError,
  TooManyError,
  type ApiErrors,
} from '/src/lib/Errors'

export function makeError(err: any) {
  if (err instanceof HTTPError) {
    switch (err.response.status) {
      case 401:
      case 403:
        return new ForbiddenError('لطفا مجددا وارد شوید')

      case 429:
        return new TooManyError(
          `تعداد درخواست های ارسالی بیش از حد مجاز است، لطفا دقایقی دیگر مجددا تلاش نمایید`,
        )

      case 400:
      case 406:
        console.log('IMPLEMENT THIS')
        return new MessageError('اطلاعات وارد شده ناقص است')
    }

    if (err.response.status >= 500) {
      return new ServerError('خطای سروری رخداده است', err.response.status)
    }
  }

  console.error(err)

  return new Error(`ارتباط برقرار نشد`)
}

export function filterFormError(obs: Observable<ZodError<any> | ApiErrors | undefined>) {
  return obs.pipe(
    map((err) => {
      if (typeof err === 'undefined') {
        return {}
      }

      if (err instanceof FormError) {
        return err.errors
      }

      if (err instanceof ZodError) {
        err.format(zodFormat)
        return err.formErrors.fieldErrors as unknown as { [key: string]: string }
      }

      return {}
    }),
  )
}

export function filterMessageError(obs: Observable<ZodError<any> | ApiErrors | undefined>) {
  return obs.pipe(
    map((err) => {
      if (typeof err === 'undefined') {
        return
      }

      if (err instanceof FormError || err instanceof ZodError) {
        return
      }

      return err.message
    }),
  )
}
