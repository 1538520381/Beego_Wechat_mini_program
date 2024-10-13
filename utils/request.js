const CONFIG = require('../config')

export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.baseUrl}${params.url}`,
      header: {
        'Authorization': CONFIG.token
      },
      method: params.method,
      data: params.data,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    });
  })
}

export const requestStream = (params) => {
  return wx.request({
    url: `${CONFIG.baseUrl}${params.url}`,
    enableChunked: true,
    header: {
      'Authorization': CONFIG.token
    },
    method: params.method,
    data: params.data,
  });
}