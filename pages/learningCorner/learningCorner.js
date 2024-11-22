const app = getApp()

const CONFIG = require('../../config')

const {
  getUserByToken
} = require("../../apis/user")

const {
  getFavoritesList,
  getCategoryList,
  getBooksListByCategoryId,
  collection,
  uncollection,
  getOutlineByBookId
} = require("../../apis/book");

const {
  addSession,
  getLearningCornerRobotList,
  getSessionList,
  getMessageList,
  chat,
  deleteSession
} = require("../../apis/chat")

const {
  isEmpty
} = require("../../utils/common");

import TextDecoder from '../../miniprogram/miniprogram-text-decoder'

Page({
  data: {
    user: {},

    robotIdToRobot: {},
    categoryIdToRobot: {},

    favorites: [],
    favoriteIds: [],
    categorys: [],
    books: [],
    outline: [],
    robots: [],
    session: null,
    messages: [],

    file: null,

    categorysActive: 0,
    booksActive: 0,

    windowHeight: 0,
    bookHeight: 0,
    mainHeight: 0,
    footerHeight: 0,

    robotFlag: true,

    menuVis: false,

    toView: 'bottomRow',
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

    this.setData({
      bookHeight: this.data.windowHeight,
    })

    await this.getLearningCornerRobotList();
    await this.getCategoryList();
    await this.getBooksListByCategoryId(null)
    await this.getFavoritesList()

    this.updateMainHeight()
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

  addSession() {
    addSession(this.data.categoryIdToRobot[this.data.books[this.data.booksActive].categoryId].id).then((res) => {
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

  removeSession() {
    deleteSession(this.data.session.id).then((res) => {
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

  getFavoritesList() {
    return getFavoritesList().then((res) => {
      if (res.data.code === 200) {
        let favorites = []
        let favoriteIds = []
        if (!isEmpty(res.data.data)) {
          for (let i = 0; i < res.data.data.length; i++) {
            favorites.push({
              id: res.data.data[i]['book_id'],
              bookName: res.data.data[i]['book_name'],
              categoryId: res.data.data[i]['lib_id']
            })
            favoriteIds.push(res.data.data[i]['book_id'])
          }
        }
        this.setData({
          favorites: favorites,
          favoriteIds: favoriteIds
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
  getLearningCornerRobotList() {
    return getLearningCornerRobotList().then((res) => {
      if (res.data.code === 200) {
        let robots = []
        for (let i = 0; i < res.data.data.length; i++) {
          let robot = {
            id: res.data.data[i]['bot_id'],
            name: res.data.data[i]['bot_name'],
            handle: res.data.data[i]['bot_handle'],
            avatar: res.data.data[i]['bot_avatar'],
            description: res.data.data[i]['description']
          }
          this.data.robotIdToRobot[robot.id] = robot
          robots.push(robot)
        }
        this.setData({
          robots: robots
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
  getCategoryList() {
    return getCategoryList().then((res) => {
      if (res.data.code === 200) {
        let categorys = []
        let categoryIdToRobot = {}
        for (let i = 0; i < res.data.data.length; i++) {
          categorys.push({
            id: res.data.data[i]['lib_id'],
            name: res.data.data[i]['lib_name'],
            robotId: res.data.data[i]['bot_id'],
            sort: res.data.data[i]['sort']
          })
          categoryIdToRobot[res.data.data[i]['lib_id']] = this.data.robotIdToRobot[res.data.data[i]['bot_id']]
        }
        categorys.sort((o1, o2) => {
          return o1.sort - o2.sort
        })
        this.setData({
          categorys: categorys,
          categorysActive: Math.min(this.data.categorysActive, categorys.length - 1),
          categoryIdToRobot: categoryIdToRobot
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
  getBooksListByCategoryId(bookId) {
    return getBooksListByCategoryId(this.data.categorys[this.data.categorysActive].id).then((res) => {
      if (res.data.code === 200) {
        let books = []
        if (!isEmpty(res.data.data)) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (bookId != null && res.data.data[i]['book_id'] === bookId) {
              this.setData({
                booksActive: i
              })
            }
            books.push({
              id: res.data.data[i]['book_id'],
              name: res.data.data[i]['book_name'],
              categoryId: res.data.data[i]['lib_id']
            })
          }
        }
        this.setData({
          books: books,
          booksActive: Math.min(this.data.booksActive, books.length - 1)
        })
        if (!isEmpty(this.data.books)) {
          this.getOutlineByBookId(this.data.books[this.data.booksActive].id)
          this.getSessionList()
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
  getSessionList() {
    return getSessionList(this.data.categoryIdToRobot[this.data.books[this.data.booksActive].categoryId].id).then((res) => {
      if (res.data.code === 200) {
        if (isEmpty(res.data.data)) {
          this.addSession();
        } else {
          let session = {
            id: res.data.data[0]['session_id'],
            botId: res.data.data[0]['bot_id'],
            userId: res.data.data[0]["user_id"],
            createTime: res.data.data[0]['created_time'],
            updateTime: res.data.data[0]['updated_time'],
            message: isEmpty(res.data.data[0]["message"]) ? null : {
              id: res.data.data[0]["message"]["message_id"],
              sessionId: res.data.data[0]["message"]["session_id"],
              role: res.data.data[0]["message"]["role"],
              content: res.data.data[0]["message"]["content"],
              contentType: res.data.data[0]["message"]["text"],
              createTime: res.data.data[0]["message"]["created_time"],
            }
          }
          this.setData({
            session: session
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
    return getMessageList(this.data.session.id).then((res) => {
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
          content: app.towxml(this.data.categoryIdToRobot[this.data.books[this.data.booksActive].categoryId].description, 'markdown')
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

  collection(data) {
    collection(data.currentTarget.dataset[""]).then((res) => {
      if (res.data.code === 200) {
        this.getFavoritesList()
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
  uncollection(data) {
    uncollection(data.currentTarget.dataset[""]).then((res) => {
      if (res.data.code === 200) {
        this.getFavoritesList()
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
  getOutlineByBookId(id) {
    getOutlineByBookId(id).then((res) => {
      if (res.data.code === 200) {
        this.setData({
          outline: res.data.data['outline_child_list']
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

  chat() {
    if (!this.data.loadingFlag) {
      this.data.requestStream = chat(
        this.data.categoryIdToRobot[this.data.books[this.data.booksActive].categoryId].id,
        this.data.session.id,
        this.data.categoryIdToRobot[this.data.books[this.data.booksActive].categoryId].handle,
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

  selectCategory(data) {
    if (data.currentTarget.dataset[""] !== this.data.categorysActive) {
      this.setData({
        categorysActive: data.currentTarget.dataset[""],
        booksActive: 0,
        menuVis: false
      })
      this.getBooksListByCategoryId(null)
    }
  },
  selectBook(data) {
    if (data.currentTarget.dataset[""] !== this.data.booksActive) {
      this.setData({
        booksActive: data.currentTarget.dataset[""]
      })
    }
    this.getOutlineByBookId(this.data.books[this.data.booksActive].id)
    this.getSessionList()
  },
  selectFavorites(data) {
    console.log(data.currentTarget.dataset["book"])
    for (let i = 0; i < this.data.categorys.length; i++) {
      if (this.data.categorys[i].id === data.currentTarget.dataset["book"].categoryId) {
        this.setData({
          categorysActive: i,
          booksActive: 0,
          menuVis: false
        })
        this.getBooksListByCategoryId()
        return
      }
    }
  },

  updateMainHeight() {
    let query = wx.createSelectorQuery().in(this);
    query.select('#footer').boundingClientRect();
    query.exec((res) => {
      this.data.footerHeight = res[0].height;
      this.setData({
        mainHeight: this.data.windowHeight - this.data.footerHeight - 20
      })
      console.log(this.data.mainHeight)
    })
  },

  input(e) {
    this.setData({
      input: e.detail.value
    })
    this.updateMainHeight()
  },

  dropDown() {
    this.setData({
      robotFlag: false,
      bookHeight: this.data.windowHeight - 18
    })
  },
  pullUp() {
    this.setData({
      robotFlag: true,
      bookHeight: this.data.windowHeight / 2
    })
  },
  openRobot() {
    this.setData({
      robotFlag: false
    })
    this.updateMainHeight()
  },
  closeRobot() {
    this.setData({
      robotFlag: true
    })
  },

  toScrollBottom() {
    this.setData({
      toView: 'bottomRow'
    })
  }
})