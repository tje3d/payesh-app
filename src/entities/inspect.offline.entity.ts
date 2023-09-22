import { z } from 'zod'

export default class InspectOffline implements IInspectOffline {
  organ_management: number
  organ_office: number
  organ_post: number
  person: number
  time: string
  // @TODO: REMOVE THIS
  user: number = 2

  constructor(opt: IInspectOffline) {
    this.organ_management = opt.organ_management
    this.organ_office = opt.organ_office
    this.organ_post = opt.organ_post
    this.person = opt.person
    this.time = opt.time
  }
}

export const InspectOfflineSchema = z.object({
  organ_management: z.number().positive(),
  organ_office: z.number().positive(),
  organ_post: z.number().positive(),
  person: z.number().positive(),
  time: z.string(),
})

export type IInspectOffline = typeof InspectOfflineSchema._type
