const CONFIG = require('../config')

export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.baseUrl}${params.url}`,
      header: {
        'Authorization': wx.getStorageSync('token')
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
  // return new Promise((resolve, reject) => {
  //   wx.cloud.callContainer({
  //     "config": {
  //       "env": "prod-7ghr1n1r9680b968"
  //     },
  //     "path": `${params.url}`,
  //     "header": {
  //       "X-WX-SERVICE": "backend",
  //       "content-type": "application/json",
  //       'Authorization': wx.getStorageSync('token')
  //     },
  //     "method": params.method,
  //     "data": params.data,
  //     success(res) {
  //       resolve(res);
  //     },
  //     fail(err) {
  //       reject(err);
  //     }
  //   })
  // })
}

export const requestStream = (params) => {
  return wx.request({
    url: `${CONFIG.baseUrl}${params.url}`,
    enableChunked: true,
    header: {
      'Authorization': wx.getStorageSync('token')
    },
    method: params.method,
    data: params.data,
  });

  // return wx.cloud.callContainer({
  //   "config": {
  //     "env": "prod-7ghr1n1r9680b968"
  //   },
  //   "path": `${params.url}`,
  //   "header": {
  //     "X-WX-SERVICE": "backend",
  //     "content-type": "application/json",
  //     'Authorization': wx.getStorageSync('token')
  //   },
  //   "method": params.method,
  //   "data": params.data,
  // })
}