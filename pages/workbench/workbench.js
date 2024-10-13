const app = getApp()

const {
  isEmpty
} = require("../../utils/common")

const {
  addSession,
  deleteSession,
  getRobotList,
  getSessionList,
  getMessageList,
  chat,
} = require("../../apis/chat")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    robots: [],
    sessions: [],
    messages: [],

    robotActive: 0,
    sessionActive: 0,

    menuVis: false,

    heightClock: null,

    input: "",

    requestStream: null,
    loadingMessage: "",
    loadingMessageMarkdown: {},
    loadingFlag: false,
    dataFlag: false,

    windowHeight: 0,
    headerHeight: 0,
    mainHeight: 0,
    footerHeight: 0,

    toView: 'bottomRow',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let _this = this

    wx.getSystemInfo({
      success: function (res) {
        _this.data.windowHeight = res.windowHeight
      }
    })
    this.data.heightClock = setInterval(() => {
      let query = wx.createSelectorQuery().in(this);
      query.select('#header').boundingClientRect();
      query.select('#footer').boundingClientRect();
      query.exec((res) => {
        this.data.headerHeight = res[0].height;
        this.data.footerHeight = res[1].height;
        this.setData({
          mainHeight: this.data.windowHeight - this.data.headerHeight - this.data.footerHeight
        })
      })
    }, 20)


    await this.getRobotList()
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

  addSession() {
    addSession(this.data.robots[this.data.robotActive].id).then((res) => {
      if (res.data.code === 200) {
        this.getSessionList();
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
  deleteSession(data) {
    deleteSession(this.data.sessions[data.currentTarget.dataset[""]].id).then((res) => {
      if (res.data.code === 200) {
        this.getSessionList()
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
  getRobotList() {
    return getRobotList().then((res) => {
      if (res.data.code === 200) {
        let robots = []
        for (let i in res.data.data) {
          robots.push({
            id: res.data.data[i]['bot_id'],
            avatar: res.data.data[i]['bot_avatar'],
            name: res.data.data[i]['bot_name'],
            description: res.data.data[i]['description'],
          })
        }
        this.setData({
          robots: robots,
          robotActive: 0
        })
        this.getSessionList()
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
  getSessionList() {
    return getSessionList(this.data.robots[this.data.robotActive].id).then((res) => {
      if (res.data.code === 200) {
        if (isEmpty(res.data.data)) {
          this.addSession();
        } else {
          let sessions = []
          for (let i in res.data.data) {
            sessions.push({
              id: res.data.data[i]['session_id'],
              botId: res.data.data[i]['bot_id'],
              userId: res.data.data[i]["user_id"],
              createTime: res.data.data[i]['created_time'],
              updateTime: res.data.data[i]['updated_time'],
              message: isEmpty(res.data.data[i]["message"]) ? null : {
                id: res.data.data[i]["message"]["message_id"],
                sessionId: res.data.data[i]["message"]["session_id"],
                role: res.data.data[i]["message"]["role"],
                content: res.data.data[i]["message"]["content"],
                contentType: res.data.data[i]["message"]["text"],
                createTime: res.data.data[i]["message"]["created_time"],
              }
            })
          }
          this.setData({
            sessions: sessions,
            sessionActive: 0
          })
          this.getMessageList()
        }
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
  getMessageList() {
    return getMessageList(this.data.sessions[this.data.sessionActive].id).then((res) => {
      if (res.data.code === 200) {
        if (this.data.loadingFlag) {
          this.data.loadingMessage = ""
          this.data.dataFlag = false
          this.setData({
            loadingFlag: false,
          })
        }

        let messages = []
        for (let i in res.data.data) {
          messages.push({
            id: res.data.data[i]['message_id'],
            sessionId: res.data.data[i]['session_id'],
            role: res.data.data[i]['role'],
            contentType: res.data.data[i]['content_type'],
            content: app.towxml(res.data.data[i]["content"], 'markdown'),
            createTime: res.data.data[i]['created_time']
          })
        }
        this.setData({
          messages: messages
        })

        this.toScrollBottom()
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
  chat() {
    if (!this.data.loadingFlag && !isEmpty(this.data.input)) {
      this.data.requestStream = chat(this.data.robots[this.data.robotActive].id, this.data.sessions[this.data.sessionActive].id, this.data.input);
      let messages = this.data.messages
      messages.push({
        role: 'user',
        contentType: 'text',
        content: app.towxml(this.data.input, 'markdown')
      })
      this.setData({
        messages: messages,
        input: '',
        loadingFlag: true,
        loadingMessage: '',
        loadingMessageMarkdown: {}
      })
      this.toScrollBottom()

      this.data.requestStream.onChunkReceived(res => {
        if (this.data.loadingFlag) {
          // const decoder = new TextDecoder('utf-8')
          // let strs = decoder.decode(res.data).split("\n")
          let strs = decodeURIComponent(escape(String.fromCharCode(...res.data))).split("\n")
          for (let i in strs) {
            if (strs[i].startsWith("event:done")) {
              let messages = this.data.messages
              messages.push({
                role: 'assistant',
                contentType: 'text',
                content: app.towxml(this.data.loadingMessage, 'markdown')
              })
              this.setData({
                messages: messages,
                loadingFlag: false,
              })
            } else if (strs[i].startsWith("event:")) {
            } else if (strs[i].startsWith("data:")) {
              if (strs[i].length !== "data:".length) {
                this.data.loadingMessage = this.data.loadingMessage + strs[i].substring("data:".length)
                this.setData({
                  loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
                })
              } else {
                if (this.data.dataFlag) {
                  this.data.loadingMessage = this.data.loadingMessage + '\n'
                  this.setData({
                    loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
                  })
                }
                this.data.dataFlag = true
              }
            } else if (strs[i].length !== 0 && this.data.dataFlag) {
              this.data.loadingMessage = this.data.loadingMessage + strs[i]
              this.setData({
                loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
              })
              this.data.dataFlag = false
            }
          }
          this.toScrollBottom()
        }
      });
    }
  },

  selectRobot(data) {
    if (data.currentTarget.dataset[""] !== this.data.robotActive) {
      this.setData({
        robotActive: data.currentTarget.dataset[""]
      })
      this.getSessionList()
    }
  },
  selectSession(data) {
    if (data.currentTarget.dataset[""] !== this.data.sessionActive) {
      this.setData({
        sessionActive: data.currentTarget.dataset[""],
        menuVis: false,
      })
      this.getMessageList()
    }
  },

  openMenu() {
    this.setData({
      menuVis: true
    })
  },
  closeMenu() {
    this.setData({
      menuVis: false
    })
  },

  toPersonalCenter(){
    wx.redirectTo({
      url: '../personalCenter/personalCenter',
    })
  },

  input(e) {
    this.setData({
      input: e.detail.value
    })
  },

  toScrollBottom() {
    this.setData({
      toView: 'bottomRow'
    })
  }
})