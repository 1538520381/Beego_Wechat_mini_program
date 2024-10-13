const {
  sleep
} = require("../../utils/common");

const {
  login
} = require("../../apis/user")

Page({
  data: {
    chats: [
      "查询常见的机器学习算法",
      "解释第一类错误是什么意思",
      "写一篇以文化多元化为主题的调研报告"
    ],
    chatIndex: 0,
    chatLen: 2,
    chatMessage: "我可以帮你",
    chatClock: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.createChatClock1();
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

  login() {
    wx.redirectTo({
      url: '../workbench/workbench',
    })
    // wx.login({
    //   success: (res) => {
    //     if (res.code) {
    //       login(res.code).then((res) => {
    //         if (res.data.code === 200) {

    //         } else {
    //           wx.showToast({
    //             title: res.data.message,
    //             duration: 1000,
    //             icon: 'error',
    //             mask: true
    //           })
    //         }
    //       }).catch((err) => {
    //         wx.showToast({
    //           title: "系统异常，请联系管理员",
    //           duration: 1000,
    //           icon: 'error',
    //           mask: true
    //         })
    //       })
    //     }
    //   },
    // })
  },

  createChatClock1() {
    this.data.chatClock = setInterval(async () => {
      this.data.chatLen++;
      this.setData({
        chatMessage: "我可以帮你" + this.data.chats[this.data.chatIndex].substring(0, this.data.chatLen) + "|"
      })
      if (this.data.chatLen > this.data.chats[this.data.chatIndex].length) {
        clearInterval(this.data.chatClock);
        await sleep(800);
        this.createChatClock2();
      }
    }, 100)
  },
  createChatClock2() {
    this.data.chatClock = setInterval(async () => {
      this.data.chatLen--;
      this.setData({
        chatMessage: "我可以帮你" + this.data.chats[this.data.chatIndex].substring(0, this.data.chatLen) + "|"
      })
      if (this.data.chatLen === 0) {
        clearInterval(this.data.chatClock);
        this.data.chatIndex = (this.data.chatIndex + 1) % this.data.chats.length
        this.createChatClock1();
      }
    }, 100)
  },
})