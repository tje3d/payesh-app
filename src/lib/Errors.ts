import type { HTTPError } from 'ky'

export class FormError {
  constructor(
    public errors: { [key: string]: string },
    public message: string = 'خطایی رخ داده است، لطفا داده ها را بررسی نمایید',
  ) {}
}

export class TooManyError {
  constructor(public message: string) {}
}

export class ServerError {
  constructor(
    public message: string,
    public code: number,
  ) {}
}

export class MessageError extends Error {}

export class ForbiddenError extends Error {}

export class NetworkException extends Error {}

export interface ApiError {
  statusCode: number
  message?: any
  error: string
}

export type ApiErrors = FormError | ForbiddenError | TooManyError | ServerError | Error | HTTPError
