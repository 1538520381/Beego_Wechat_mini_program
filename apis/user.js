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

const improvePersonalInformation = (userName, school, major, enterTime) => {
  return request({
    url: '/user/mustInfo',
    method: 'POST',
    data: {
      user_name: userName,
      school: school,
      major: major,
      enter_time: enterTime
    }
  })
}

module.exports = {
  login,
  getUserByToken,
  improvePersonalInformation
}