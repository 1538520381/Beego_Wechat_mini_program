import {
  request
} from '../utils/request'

const login = (code) => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      code: code
    }
  })
}

const getUserByToken = () => {
  return request({
    url: '/user/token',
    method: 'POST'
  })
}

module.exports = {
  login,
  getUserByToken
}