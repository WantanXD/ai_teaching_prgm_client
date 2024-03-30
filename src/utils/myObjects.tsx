
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

export type authObj = {
  data: {
    isAuthenticated: boolean,
    jwtToken?: string,
    user?:{
      name: string,
      id: number,
    },
  },
}