const {
  isEmpty
} = require("../../utils/common")

const {
  improvePersonalInformation
} = require("../../apis/user")

// pages/personalInformation/personalInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  confirm() {
    if (isEmpty(this.data.user.userName)) {
      wx.showToast({
        title: "昵称不能为空",
        duration: 1000,
        icon: 'none',
        mask: true
      })
    } else if (isEmpty(this.data.user.school)) {
      wx.showToast({
        title: "所在学校不能为空",
        duration: 1000,
        icon: 'none',
        mask: true
      })
    } else if (isEmpty(this.data.user.major)) {
      wx.showToast({
        title: "所在专业不能为空",
        duration: 1000,
        icon: 'none',
        mask: true
      })
    } else if (isEmpty(this.data.user.enterTime)) {
      wx.showToast({
        title: "入学年份不能为空",
        duration: 1000,
        icon: 'none',
        mask: true,

      })
    } else {
      improvePersonalInformation(this.data.user.userName, this.data.user.school, this.data.user.major, this.data.user.enterTime).then((res) => {
        if (res.data.code === 200) {
          this.toWorkbench()
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 1000,
            icon: 'none',
            mask: true
          })
        }
      }).catch((err) => {
        console.log(err)
        wx.showToast({
          title: "系统异常，请联系管理员",
          duration: 1000,
          icon: 'none',
          mask: true
        })
      })
    }
  },

  toWorkbench() {
    wx.redirectTo({
      url: '../workbench/workbench',
    })
  },

  userNameInput(e) {
    let user = this.data.user
    user.userName = e.detail.value
    this.setData({
      user: user
    })
  },
  schoolInput(e) {
    let user = this.data.user
    user.school = e.detail.value
    this.setData({
      user: user
    })
  },
  majorInput(e) {
    let user = this.data.user
    user.major = e.detail.value
    this.setData({
      user: user
    })
  },
  enterTimeInput(e) {
    let user = this.data.user
    user.enterTime = e.detail.value
    this.setData({
      user: user
    })
  },
})