const {
  schoolCategoryMajor
} = require("../../utils/constant")

const {
  isEmpty
} = require("../../utils/common")

const {
  getUserByToken,
  modifyInformation
} = require("../../apis/user")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},

    schools: [],
    categorys: [],
    majors: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.initConstant()

    await this.getUserByToken()
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

  initConstant() {
    this.setData({
      schools: Object.keys(schoolCategoryMajor)
    })
  },

  getUserByToken() {
    return getUserByToken().then((res) => {
      if (res.data.code === 200) {
        this.setData({
          user: {
            id: res.data.data["user_id"],
            avatar: isEmpty(res.data.data["avatar_url"]) ? '../../assets/pictures/test.jpg' : res.data.data["avatar_url"],
            userName: res.data.data["user_name"],
            gender: String(res.data.data["gender"]),
            school: res.data.data["school"],
            major: res.data.data["major"],
            enterTime: res.data.data["enter_time"]
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 1000,
          icon: 'error',
          mask: true
        })
      }
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: "系统异常，请联系管理员",
        duration: 1000,
        icon: 'error',
        mask: true
      })
    })
  },

  cancel() {
    wx.switchTab({
      url: '/pages/personalCenter/personalCenter'
    })
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
      modifyInformation(this.data.user.userName, this.data.user.gender, this.data.user.school, this.data.user.major, this.data.user.enterTime).then((res) => {
        if (res.data.code === 200) {
          wx.switchTab({
            url: '/pages/personalCenter/personalCenter'
          })
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
    wx.switchTab({
      url: '/pages/workbench/workbench'
    })
  },

  userNameInput(e) {
    let user = this.data.user
    user.userName = e.detail.value
    this.setData({
      user: user
    })
  },
  genderChange(e) {
    this.data.user.gender = e.detail.value
  },
  selectSchool(e) {
    let user = this.data.user
    user.school = this.data.schools[e.detail.value]
    user.major = null

    this.data.categorys = Object.keys(schoolCategoryMajor[user.school])
    let majors = []
    for (let i in this.data.categorys) {
      let categoryMajors = schoolCategoryMajor[user.school][this.data.categorys[i]]
      for (let j in categoryMajors) {
        majors.push(categoryMajors[j])
      }
    }
    this.setData({
      user: user,
      majors: majors
    })
  },
  selectMajor(e) {
    let user = this.data.user
    user.major = this.data.majors[e.detail.value]

    this.setData({
      user: user,
    })
  },
  majorInput(e) {
    let user = this.data.user
    user.major = e.detail.value
    this.setData({
      user: user
    })
  },
  selectEnterYear(e) {
    let user = this.data.user
    user.enterTime = e.detail.value

    this.setData({
      user: user,
    })
  }
})