import { z } from 'zod'

export default class InspectNew implements IInspectNew {
  organ_management: number
  organ_office: number
  organ_post: number
  person: number
  date: string
  time: string
  items: number[]

  constructor(opt: IInspectNew) {
    this.organ_management = opt.organ_management
    this.organ_office = opt.organ_office
    this.organ_post = opt.organ_post
    this.person = opt.person
    this.date = opt.date
    this.time = opt.time
    this.items = opt.items
  }
}

export const InspectNewSchema = z.object({
  organ_management: z.number().positive(),
  organ_office: z.number().positive(),
  organ_post: z.number().positive(),
  person: z.number().positive(),
  date: z.string(),
  time: z.string(),
  items: z.number().array(),
})

export type IInspectNew = typeof InspectNewSchema._type
