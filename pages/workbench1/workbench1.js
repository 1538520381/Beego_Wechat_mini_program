const {
  isEmpty
} = require("../../utils/common")

const {
  getUserByToken
} = require("../../apis/user")
const {
  getRobotList,
  getRobotById
} = require("../../apis/chat")

Page({
  data: {
    user: {},

    robotList: [],
    robotActive: 0,

    linkRobot: {},
    linkRobotFlag: false,

    robotIdToSessionActiveId: {},

    menuVis: false,
    menuEnabled: true,
  },

  async onLoad(options) {
    let _this = this

    await this.getUserByToken()
    await this.getRobotList()
  },

  getUserByToken() {
    return getUserByToken().then((res) => {
      if (res.data.code === 200) {
        this.setData({
          user: {
            id: res.data.data["user_id"],
            avatar: res.data.data["avatar_url"],
            name: res.data.data["user_name"],
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

  getRobotList() {
    return getRobotList().then((res) => {
      if (res.data.code === 200) {
        let robotList = []
        for (let i in res.data.data) {
          robotList.push({
            id: res.data.data[i]["bot_id"],
            name: res.data.data[i]["bot_name"],
            avatar: res.data.data[i]["bot_avatar"],
            description: res.data.data[i]["description"],
            handle: res.data.data[i]["bot_handle"],
            prompts: res.data.data[i]["prompts"],
            type: res.data.data[i]["bot_front_flag"],
            linkRobotId: res.data.data[i]["attach_bot_id"],
            sort: res.data.data[i]["sort"],
          })
          if (!isEmpty(res.data.data[i]['attach_bot_id'])) {
            getRobotById(res.data.data[i]['attach_bot_id']).then((res1) => {
              this.setData({
                linkRobot: {
                  id: res.data.data[i]['attach_bot_id'],
                  handle: res1.data.data['bot_handle'],
                  avatar: res1.data.data['bot_avatar'],
                  description: res1.data.data['description'],
                  prompts: res1.data.data['prompts']
                }
              })
            })
          }
        }
        robotList.sort((o1, o2) => {
          return o1.sort - o2.sort
        })
        this.setData({
          robotList: robotList,
          robotActive: 0
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
  selectRobot(data) {
    if (data.currentTarget.dataset["index"] !== this.data.robotActive) {
      this.setData({
        robotActive: data.currentTarget.dataset["index"],
      })
    }
  },

  selectSession(data) {
    let robotIdToSessionActiveId = this.data.robotIdToSessionActiveId
    robotIdToSessionActiveId[data.detail.robotId] = data.detail.sessionId
    this.setData({
      robotIdToSessionActiveId: robotIdToSessionActiveId
    })
  },

  selectLinkRobot() {
    this.setData({
      linkRobotFlag: !this.data.linkRobotFlag
    })
  },

  openMenu() {
    // if (this.data.menuEnabled) {
      this.setData({
        menuVis: true
      })
    // }
  },
  closeMenu() {
    this.setData({
      menuVis: false
    })
  },

  setMenuEnabled(data) {
    this.setData({
      menuEnabled: data.detail.menuEnabled
    })
  }
})