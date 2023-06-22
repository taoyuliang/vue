import Cookies from 'js-cookie'
const CommonKey = 'user_common'
const TokenKey = 'Admin2-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function getCommon () {
  return Cookies.get(CommonKey)
}

export function setCommon (common) {
  return Cookies.set(CommonKey, common)
}
