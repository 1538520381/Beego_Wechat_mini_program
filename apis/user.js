import {
  request
} from '../utils/request'

const login = (phoneCode, code) => {
  return request({
    url: '/wechat/user/login',
    method: 'POST',
    data: {
      phone_code: phoneCode,
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

const improvePersonalInformation = (userName, gender, school, major, enterTime) => {
  return request({
    url: '/user/mustInfo',
    method: 'POST',
    data: {
      user_name: userName,
      gender: gender,
      school: school,
      major: major,
      enter_time: enterTime
    }
  })
}

const modifyInformation = (userName, gender, school, major, enterTime) => {
  return request({
    url: '/user/update',
    method: 'POST',
    data: {
      user_name: userName,
      gender: gender,
      school: school,
      major: major,
      enter_time: enterTime
    }
  })
}

module.exports = {
  login,
  getUserByToken,
  improvePersonalInformation,
  modifyInformation
}