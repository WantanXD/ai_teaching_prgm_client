
export type questionObj = {
  id: number,
  question: string,
  answer: string,
  modelAns?: string,
  tof: boolean,
  reasons?: string,
  comment: string,
  lang: string,
  userId: number
}