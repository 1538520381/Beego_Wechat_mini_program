// app.js
require('./js/EncoderDecoderTogether.min')
App({
  onLaunch() {
    wx.cloud.init({
      env: "prod-7ghr1n1r9680b968"
    })
  },
  globalData: {
    userInfo: null
  },
  towxml: require('./towxml/index')
})
