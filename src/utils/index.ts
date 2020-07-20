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