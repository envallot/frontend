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

export const validateMoney = (value: string) => {

  const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
  if (regex.test(value)) {
    //Input is valid, check the number of decimal places
    var twoDecimalPlaces = /\.\d{2}$/g;
    var oneDecimalPlace = /\.\d{1}$/g;
    var noDecimalPlacesWithDecimal = /\.\d{0}$/g;

    if (value.match(twoDecimalPlaces)) {
      //all good, return as is
      return value;
    }
    if (value.match(noDecimalPlacesWithDecimal)) {
      //add two decimal places
      return value + '00';
    }
    if (value.match(oneDecimalPlace)) {
      //ad one decimal place
      return value + '0';
    }
    //else there is no decimal places and no decimal
    return value + ".00";
  }
  return false
}
