const app = getApp()

const CONFIG = require('../../config')

const {
  getUserByToken
} = require("../../apis/user")

import TextDecoder from '../../miniprogram/miniprogram-text-decoder'

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
  longTextDialogueSubmit,
  longTextDialogueQuery
} = require("../../apis/chat")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},

    robots: [],
    sessions: [],
    messages: [],

    robotActive: 0,
    sessionActive: 0,

    menuVis: false,

    heightClock: null,

    input: null,
    file: null,

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

    questionMarkdown: null,
    answer: null,
    answerFlag: false,
    webViewFlag: 0,

    clock: null,
    timestamp: 0,

    sessionIdInLongTextDialogueExecuteEntitys: false,
    longLoadingMessage1: app.towxml("题目分析中.", "markdown"),
    longLoadingMessage2: app.towxml("题目分析中. .", "markdown"),
    longLoadingMessage3: app.towxml("题目分析中. . .", "markdown"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let _this = this

    await this.getUserByToken()

    wx.getSystemInfo({
      success: function (res) {
        _this.data.windowHeight = res.windowHeight
      }
    })

    await this.getRobotList()

    this.clock = setInterval(() => {
      this.setData({
        timestamp: this.data.timestamp + 1
      })
    }, 500)

    setInterval(() => {
      this.longTextDialogueQuery()
    }, 60 * 1000)

    this.updateMainHeight()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.updateMainHeight()
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
            avatar: isEmpty(res.data.data["avatar_url"]) ? '../../assets/pictures/test.jpg' : res.data.data["avatar_url"],
            userName: res.data.data["user_name"],
            gender: res.data.data["gender"],
            school: res.data.data["school"],
            major: res.data.data["major"],
            enterTime: res.data.data["enter_time"]
          }
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
  addSession() {
    addSession(this.data.robots[this.data.robotActive].id).then((res) => {
      if (res.data.code === 200) {
        this.getSessionList();
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
  deleteSession(data) {
    deleteSession(this.data.sessions[data.currentTarget.dataset[""]].id).then((res) => {
      if (res.data.code === 200) {
        this.getSessionList()
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
  getRobotList() {
    return getRobotList().then((res) => {
      if (res.data.code === 200) {
        let robots = []
        for (let i in res.data.data) {
          robots.push({
            id: res.data.data[i]['bot_id'],
            avatar: res.data.data[i]['bot_avatar'],
            name: res.data.data[i]['bot_name'],
            description: app.towxml(res.data.data[i]['description'], 'markdown'),
            handle: res.data.data[i]['bot_handle'],
            sort: res.data.data[i]['sort'],
            prompts: res.data.data[i]["prompts"]
          })
        }
        robots.sort((o1, o2) => {
          return o1.sort - o2.sort
        })
        this.setData({
          robots: robots,
          robotActive: 0
        })
        this.getSessionList()
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
          sessions.sort(function (o1, o2) {
            return new Date(o2.createTime.replace(/-/g, '/')).getTime() - new Date(o1.createTime.replace(/-/g, '/')).getTime()
          })
          this.setData({
            sessions: sessions,
            sessionActive: Math.min(this.data.sessionActive, sessions.length - 1)
          })
          this.getMessageList()
        }
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
        messages.push({
          role: 'assistant',
          content: this.data.robots[this.data.robotActive].description
        })
        for (let i in res.data.data) {
          messages.push({
            id: res.data.data[i]['message_id'],
            sessionId: res.data.data[i]['session_id'],
            role: res.data.data[i]['role'],
            content: isEmpty(res.data.data[i]["content"]) ? null : app.towxml(res.data.data[i]["content"], 'markdown'),
            fileType: res.data.data[i]['file_type'],
            fileName: res.data.data[i]['file_name'],
            fileUrl: res.data.data[i]['file_url'],
            createTime: res.data.data[i]['created_time']
          })
        }
        this.setData({
          messages: messages
        })

        this.isSessionIdInLongTextDialogueExecuteEntitys(this.data.sessions[this.data.sessionActive].id)

        this.toScrollBottom()
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
  chat() {
    if (!this.data.loadingFlag) {
      this.data.requestStream = chat(
        this.data.robots[this.data.robotActive].id,
        this.data.sessions[this.data.sessionActive].id,
        this.data.robots[this.data.robotActive].handle,
        this.data.input,
        isEmpty(this.data.file) ? null : this.data.file.fileType,
        isEmpty(this.data.file) ? null : this.data.file.fileName,
        isEmpty(this.data.file) ? null : this.data.file.fileUrl
      );

      let messages = this.data.messages
      messages.push({
        role: 'user',
        content: isEmpty(this.data.input) ? null : app.towxml(this.data.input, 'markdown'),
        fileType: isEmpty(this.data.file) ? null : this.data.file.fileType,
        fileName: isEmpty(this.data.file) ? null : this.data.file.fileName,
        fileUrl: isEmpty(this.data.file) ? null : this.data.file.fileUrl
      })
      this.setData({
        messages: messages,
        input: "",
        file: null,
        loadingFlag: true,
        loadingMessage: '',
        loadingMessageMarkdown: {}
      })
      this.updateMainHeight()
      this.toScrollBottom()

      this.data.dataFlag = false

      this.data.requestStream.onChunkReceived(res => {
        console.log(res.data)
        if (this.data.loadingFlag) {

          let strs = []
          try {
            const arrayBuffer = new Uint8Array(res.data)
            let str = new TextDecoder().decode(arrayBuffer)
            strs = str.split("\n")
          } catch (e) {
            wx.showToast({
              title: "系统异常，请联系管理员",
              duration: 1000,
              icon: 'none',
              mask: true
            })
            console.log(e)
            let messages = this.data.messages
            messages.push({
              role: 'assistant',
              content: app.towxml('系统异常', 'markdown')
            })
            this.setData({
              messages: messages,
              loadingMessage: "",
              loadingFlag: false,
            })
            return
          }

          console.log(strs)
          for (let i in strs) {
            if (strs[i].startsWith("event:all")) {
              this.data.dataFlag = true
            } else if (strs[i].startsWith("event:done")) {
              let messages = this.data.messages
              messages.push({
                role: 'assistant',
                content: app.towxml(this.data.loadingMessage.replace(/\\n/g, "\n"), 'markdown')
              })
              this.setData({
                messages: messages,
                loadingMessage: "",
                loadingFlag: false,
              })
            } else if (strs[i].startsWith("event:")) {

            } else if (strs[i].startsWith("data:")) {
              if (!this.data.dataFlag) {
                this.data.loadingMessage += strs[i].substring(5)
              } else {
                this.data.loadingMessage = strs[i].substring(5)
                this.data.dataFlag = false
              }
              this.setData({
                loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
              })
            } else {
              this.data.loadingMessage += strs[i]
              this.setData({
                loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
              })
            }
          }
        }
      });
    }
  },
  promptChat(data) {
    this.setData({
      input: data.currentTarget.dataset["input"]
    })
    this.updateMainHeight()
    // if (!this.data.loadingFlag) {
    //   this.data.requestStream = chat(
    //     this.data.robots[this.data.robotActive].id,
    //     this.data.sessions[this.data.sessionActive].id,
    //     this.data.robots[this.data.robotActive].handle,
    //     data.currentTarget.dataset["input"],
    //     null,
    //     null,
    //     null
    //   );

    //   let messages = this.data.messages
    //   messages.push({
    //     role: 'user',
    //     content: app.towxml(data.currentTarget.dataset["input"], 'markdown')
    //   })
    //   this.setData({
    //     messages: messages,
    //     loadingFlag: true,
    //     loadingMessage: '',
    //     loadingMessageMarkdown: {}
    //   })
    //   this.updateMainHeight()
    //   this.toScrollBottom()

    //   this.data.dataFlag = false

    //   this.data.requestStream.onChunkReceived(res => {
    //     console.log(res.data)
    //     if (this.data.loadingFlag) {

    //       let strs = []
    //       try {
    //         const arrayBuffer = new Uint8Array(res.data)
    //         let str = new TextDecoder().decode(arrayBuffer)
    //         strs = str.split("\n")
    //       } catch (e) {
    //         wx.showToast({
    //           title: "系统异常，请联系管理员",
    //           duration: 1000,
    //           icon: 'none',
    //           mask: true
    //         })
    //         console.log(e)
    //       }

    //       console.log(strs)
    //       for (let i in strs) {
    //         if (strs[i].startsWith("event:all")) {
    //           this.data.dataFlag = true
    //         } else if (strs[i].startsWith("event:done")) {
    //           let messages = this.data.messages
    //           messages.push({
    //             role: 'assistant',
    //             content: app.towxml(this.data.loadingMessage.replace(/\\n/g, "\n"), 'markdown')
    //           })
    //           this.setData({
    //             messages: messages,
    //             loadingMessage: "",
    //             loadingFlag: false,
    //           })
    //         } else if (strs[i].startsWith("event:")) {

    //         } else if (strs[i].startsWith("data:")) {
    //           if (!this.data.dataFlag) {
    //             this.data.loadingMessage += strs[i].substring(5)
    //           } else {
    //             this.data.loadingMessage = strs[i].substring(5)
    //             this.data.dataFlag = false
    //           }
    //           this.setData({
    //             loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
    //           })
    //         } else {
    //           this.data.loadingMessage += strs[i]
    //           this.setData({
    //             loadingMessageMarkdown: app.towxml(this.data.loadingMessage, 'markdown')
    //           })
    //         }
    //       }
    //     }
    //   });
    // }
  },
  imageAnalyze() {
    if (!this.data.loadingFlag) {
      this.data.requestStream = chat(
        this.data.robots[this.data.robotActive].id,
        this.data.sessions[this.data.sessionActive].id,
        this.data.robots[this.data.robotActive].handle,
        null,
        isEmpty(this.data.file) ? null : this.data.file.fileType,
        isEmpty(this.data.file) ? null : this.data.file.fileName,
        isEmpty(this.data.file) ? null : this.data.file.fileUrl
      );

      this.data.dataFlag = false
      this.data.loadingFlag = true

      this.data.requestStream.onChunkReceived(res => {
        if (this.data.loadingFlag) {
          let strs = []
          try {
            const arrayBuffer = new Uint8Array(res.data)
            let str = new TextDecoder().decode(arrayBuffer)
            strs = str.split("\n")
          } catch (e) {
            wx.showToast({
              title: "系统异常，请联系管理员",
              duration: 1000,
              icon: 'none',
              mask: true
            })
            console.log(e)
            let messages = this.data.messages
            messages.push({
              role: 'assistant',
              content: app.towxml('系统异常', 'markdown')
            })
            this.setData({
              messages: messages,
              loadingMessage: "",
              loadingFlag: false,
            })
            return
          }
          console.log(strs)
          for (let i in strs) {
            if (strs[i].startsWith("event:all")) {
              this.data.dataFlag = true
            } else if (strs[i].startsWith("event:done")) {
              this.setData({
                input: this.data.loadingMessage,
                questionMarkdown: app.towxml(this.data.loadingMessage, "markdown"),
                loadingMessage: "",
                loadingFlag: false,
              })
            } else if (strs[i].startsWith("event:")) {

            } else if (strs[i].startsWith("data:")) {
              if (!this.data.dataFlag) {
                this.data.loadingMessage += strs[i].substring(5)
              } else {
                this.data.loadingMessage = strs[i].substring(5)
                this.data.dataFlag = false
              }
              this.setData({
                loadingMessageMarkdown: this.data.loadingMessage
              })
            } else {
              this.data.loadingMessage += strs[i]
              this.setData({
                loadingMessageMarkdown: this.data.loadingMessage
              })
            }
          }
        }
      });
    }
  },
  sendQuestion() {
    if (!this.data.loadingFlag) {
      this.data.requestStream = chat(
        this.data.robots[this.data.robotActive].id,
        this.data.sessions[this.data.sessionActive].id,
        this.data.robots[this.data.robotActive].handle,
        this.data.input,
        null, null, null
      );

      this.data.dataFlag = false
      this.data.loadingFlag = true
      this.setData({
        answerFlag: true
      })

      this.data.requestStream.onChunkReceived(res => {
        if (this.data.loadingFlag) {
          let strs = []
          try {
            const arrayBuffer = new Uint8Array(res.data)
            let str = new TextDecoder().decode(arrayBuffer)
            strs = str.split("\n")
          } catch (e) {
            wx.showToast({
              title: "系统异常，请联系管理员",
              duration: 1000,
              icon: 'none',
              mask: true
            })
            console.log(e)
            let messages = this.data.messages
            messages.push({
              role: 'assistant',
              content: app.towxml('系统异常', 'markdown')
            })
            this.setData({
              messages: messages,
              loadingMessage: "",
              loadingFlag: false,
            })
            return
          }
          console.log(strs)
          for (let i in strs) {
            if (strs[i].startsWith("event:all")) {
              this.data.dataFlag = true
            } else if (strs[i].startsWith("event:done")) {
              this.setData({
                answer: this.data.loadingMessage.replace(/#/g, '\\#'),
                answerFlag: false,
                loadingMessage: "",
                loadingFlag: false,
              })
            } else if (strs[i].startsWith("event:")) {

            } else if (strs[i].startsWith("data:")) {
              if (!this.data.dataFlag) {
                this.data.loadingMessage += strs[i].substring(5)
              } else {
                this.data.loadingMessage = strs[i].substring(5)
                this.data.dataFlag = false
              }
              this.setData({
                loadingMessageMarkdown: this.data.loadingMessage
              })
            } else {
              this.data.loadingMessage += strs[i]
              this.setData({
                loadingMessageMarkdown: this.data.loadingMessage
              })
            }
          }
        }
      });
    }
  },
  longTextDialogueSubmit() {
    let messages = this.data.messages
    messages.push({
      role: 'user',
      content: isEmpty(this.data.input) ? null : app.towxml(this.data.input, 'markdown'),
      fileType: isEmpty(this.data.file) ? null : this.data.file.fileType,
      fileName: isEmpty(this.data.file) ? null : this.data.file.fileName,
      fileUrl: isEmpty(this.data.file) ? null : this.data.file.fileUrl
    })
    longTextDialogueSubmit(this.data.robots[this.data.robotActive].id, this.data.sessions[this.data.sessionActive].id, this.data.robots[this.data.robotActive].handle, this.data.input, isEmpty(this.data.file) ? null : this.data.file.fileType, isEmpty(this.data.file) ? null : this.data.file.fileName, isEmpty(this.data.file) ? null : this.data.file.fileUrl).then((res) => {
      if (res.data.code === 200) {
        app.globalData.longTextDialogueExecuteEntitys.push({
          robotId: this.data.robots[this.data.robotActive].id,
          sessionId: this.data.sessions[this.data.sessionActive].id,
          executeId: res.data.data['execute_id'],
        })
        this.isSessionIdInLongTextDialogueExecuteEntitys(this.data.sessions[this.data.sessionActive].id)
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
    this.setData({
      input: "",
      file: null,
      messages: messages
    })
  },
  longTextDialogueQuery() {
    console.log(app.globalData.longTextDialogueExecuteEntitys)
    for (let i = 0; i < app.globalData.longTextDialogueExecuteEntitys.length; i++) {
      longTextDialogueQuery(app.globalData.longTextDialogueExecuteEntitys[i].robotId, app.globalData.longTextDialogueExecuteEntitys[i].sessionId, app.globalData.longTextDialogueExecuteEntitys[i].executeId).then((res) => {
        if (res.data.code === 200) {
          wx.showToast({
            title: "长文本生成完毕",
            duration: 1000,
            icon: 'none',
            mask: true
          })
          if (app.globalData.longTextDialogueExecuteEntitys[i].sessionId === this.data.sessions[this.data.sessionActive].id) {
            this.getMessageList()
          }
          app.globalData.longTextDialogueExecuteEntitys.splice(i, 1)
          i--
        } else {

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

  uploadFile(file, type) {
    let _this = this
    wx.uploadFile({
      url: 'https://backend-128151-8-1331511268.sh.run.tcloudbase.com/file/uploadPicture?bucketType=1',
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
        _this.updateMainHeight()
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
        _this.uploadFile(file, 0)
      },
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
      file: null
    })
    this.updateMainHeight()
  },

  openFile(data) {
    console.log(data)
    console.log(data.currentTarget.dataset["url"])
    wx.downloadFile({
      url: data.currentTarget.dataset["url"],
      success: function (res) {
        console.log(res)
        let path = res.tempFilePath;
        wx.openDocument({
          filePath: path,
          showMenu: true,
          success: function () {

          },
          fail: function (e) {
            console.log(e)
            wx.showToast({
              title: "该类型文件暂不支持预览",
              duration: 1000,
              icon: 'none',
              mask: true
            })
          }
        })
      }
    })
  },

  selectRobot(data) {
    if (data.currentTarget.dataset[""] !== this.data.robotActive) {
      this.setData({
        robotActive: data.currentTarget.dataset[""],
        file: null,
        input: null,
        answer: null
      })
      this.getSessionList()
    }
  },
  selectSession(data) {
    if (data.currentTarget.dataset[""] !== this.data.sessionActive) {
      this.setData({
        sessionActive: data.currentTarget.dataset[""],
        menuVis: false,
        file: null,
        input: null,
        answer: null
      })
      this.getMessageList()
    }
  },

  openMenu() {
    if (!this.data.loadingFlag) {
      this.setData({
        menuVis: true
      })
    }
  },
  closeMenu() {
    this.setData({
      menuVis: false
    })
  },

  updateMainHeight() {
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
  },

  input(e) {
    this.setData({
      input: e.detail.value
    })
    this.updateMainHeight()
  },
  inputQuestion(e) {
    this.setData({
      input: e.detail.value,
    })
    this.setData({
      questionMarkdown: app.towxml(this.data.input, 'markdown')
    })
  },

  isSessionIdInLongTextDialogueExecuteEntitys(sessionId) {
    console.log(app.globalData.longTextDialogueExecuteEntitys)
    for (let i = 0; i < app.globalData.longTextDialogueExecuteEntitys.length; i++) {
      if (app.globalData.longTextDialogueExecuteEntitys[i].sessionId === sessionId) {
        this.setData({
          sessionIdInLongTextDialogueExecuteEntitys: true
        })
        return
      }
    }
    this.setData({
      sessionIdInLongTextDialogueExecuteEntitys: false
    })
  },

  toScrollBottom() {
    this.setData({
      toView: 'bottomRow'
    })
  },

  openWebview() {
    this.setData({
      webViewFlag: 1
    })
    console.log(this.data.answer)
    console.log('https://7072-prod-7ghr1n1r9680b968-1331511268.tcb.qcloud.la/latex/index.html?text=' + this.data.answer)
  },

  bindGetMsg(e) {
    console.log(1)
    console.log(e)
    console.log(2)
  },

  loadSuccess(e) {
    if (this.data.webViewFlag === 1) {
      this.setData({
        webViewFlag: 2
      })
    } else if (this.data.webViewFlag === 2) {
      this.setData({
        webViewFlag: 0
      })
    }
  },
})