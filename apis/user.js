import {
  request
} from '../utils/request'

const login = (code) => {
  return request({
    url: '/wechat/user/LoginNew',
    method: 'POST',
    data: {
      code: code
    }
  })
}

const fillPhone = (code) => {
  return request({
    url: '/wechat/user/fillPhone',
    method:'POST',
    data: {
      phone_code: code
    }
  })
}

const logout = () => {
  return request({
    url: '/user/logout',
    method: 'POST'
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

const feedback = (content, fileId, fileName, fileUrl, fileType) => {
  return request({
    url: '/feedback/save',
    method: 'POST',
    data: {
      feedback_content: content,
      file_id: fileId,
      file_name: fileName,
      file_url: fileUrl,
      file_type: fileType
    }
  })
}

module.exports = {
  login,
  logout,
  getUserByToken,
  improvePersonalInformation,
  modifyInformation,
  feedback,
  fillPhone
}