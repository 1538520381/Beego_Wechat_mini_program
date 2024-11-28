const CONFIG = require('../../config')

const {
  isEmpty
} = require("../../utils/common")

const {
  logout,
  getUserByToken,
  feedback
} = require("../../apis/user")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},

    input: "",
    file: {},

    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
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

  getUserByToken() {
    return getUserByToken().then((res) => {
      if (res.data.code === 200) {
        this.setData({
          user: {
            id: res.data.data["user_id"],
            avatarUrl: isEmpty(res.data.data["avatar_url"]) ? '../../assets/pictures/test.jpg' : res.data.data["avatar_url"],
            userName: res.data.data["user_name"],
            gender: res.data.data["gender"],
            school: res.data.data["school"],
            major: res.data.data["major"],
            enterTime: res.data.data["enter_time"],
            tag: res.data.data["tag"]
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

  uploadFile(file, type) {
    let _this = this
    wx.uploadFile({
      url: CONFIG.baseUrl + '/file/uploadPicture?bucketType=1',
      method: "POST",
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      filePath: type === 0 ? file[0].tempFilePath : file[0].path,
      name: 'file',
      success(res) {
        res.data = JSON.parse(res.data)
        _this.setData({
          file: {
            id: res.data.data['file_id'],
            fileName: res.data.data['file_name'],
            fileType: res.data.data['file_type'],
            fileUrl: res.data.data['file_url']
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  userUploadFile() {
    let _this = this

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const file = res.tempFiles
        _this.uploadFile(file, 1)
      }
    })
  },
  removeFile() {
    this.setData({
      file: {}
    })
  },
  feedback() {
    if (isEmpty(this.data.input)) {
      wx.showToast({
        title: "请描述您遇到的问题",
        duration: 1000,
        icon: 'none',
        mask: true
      })
      return
    }
    feedback(
      this.data.input,
      isEmpty(this.data.file) ? null : this.data.file.id,
      isEmpty(this.data.file) ? null : this.data.file.fileName,
      isEmpty(this.data.file) ? null : this.data.file.fileUrl,
      isEmpty(this.data.file) ? null : this.data.file.fileType
    ).then((res) => {
      if (res.data.code === 200) {
        wx.showToast({
          title: res.data.message,
          duration: 1000,
          icon: 'none',
          mask: true
        })
        this.closeDialog()
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
  },

  uploadAvatar(file, type) {
    let _this = this
    wx.uploadFile({
      url: CONFIG.baseUrl + '/user/avatar',
      method: "POST",
      header: {
        'Authorization': wx.getStorageSync('token')
      },
      filePath: type === 0 ? file[0].tempFilePath : file[0].path,
      name: 'file',
      success(res) {
        res.data = JSON.parse(res.data)
        if (res.data.code === 200) {
          _this.getUserByToken()
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 1000,
            icon: 'error',
            mask: true
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  userUploadImage() {
    let _this = this

    wx.chooseMedia({
      count: 1,
      success(res) {
        const file = res.tempFiles
        _this.uploadAvatar(file, 0)
      },
    })
  },
  updateInformation() {
    wx.redirectTo({
      url: '/pages/modifyInformation/modifyInformation',
    })
  },

  logout() {
    logout().then((res) => {
      if (res.data.code === 200) {
        wx.removeStorageSync('token')
        wx.redirectTo({
          url: '/pages/home/home',
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
  },

  openDialog() {
    this.setData({
      showModal: true,
      input: "",
      file: null
    })
  },
  closeDialog() {
    this.setData({
      showModal: false
    })
  },

  input(e) {
    this.setData({
      input: e.detail.value
    })
  },
})