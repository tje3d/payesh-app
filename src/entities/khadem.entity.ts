export default class Khadem implements IKhadem {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public code: string,
    public image: string,
  ) {}
}

export interface IKhadem {
  id: number
  first_name: string
  last_name: string
  code: string
}
