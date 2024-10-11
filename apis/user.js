import {
  request
} from '../utils/request'

const login = ({
  code
}) => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      code: code
    }
  })
}

module.exports = {
  login
}