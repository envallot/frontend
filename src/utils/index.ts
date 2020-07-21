import axios, { Method } from 'axios'

export const fetch = (path: string, method: Method, data: any = {}) => {
  return axios.create({
    baseURL: process.env.REACT_APP_URL
  })(path, {
    method,
    data,
    withCredentials: true
  })
}

export class NetworkError {
  message: string
  code: string

  constructor(code: string, message: string, ) {
    this.code = code
    this.message = message
  }
}

export const round = (num: number) => {
  return Math.round(100 * num) / 100
}