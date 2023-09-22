export class Toast implements IToast {
  type: ToastTypes
  message: string
  time: number

  constructor(opt: IToast) {
    this.type = opt.type
    this.message = opt.message
    this.time = opt.time
  }
}

export interface IToast {
  type: ToastTypes
  message: string
  time: number
}

export enum ToastTypes {
  SUCCESS,
  ERROR,
}
