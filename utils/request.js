const CONFIG = require('../config')

export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.baseUrl}${params.url}`,
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