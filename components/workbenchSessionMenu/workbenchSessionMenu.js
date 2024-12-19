const {
  isEmpty
} = require("../../utils/common")

const {
  addSession,
  deleteSession,
  getSessionList,
} = require("../../apis/chat")

Component({
  properties: {
    robotId: {
      type: BigInt,
      value: null
    }
  },

  observers: {
    'robotId': function (params) {
      if(!isEmpty(params)){
        this.getSessionList(params)
      }
    }
  },

  data: {
    sessionList: [],
    sessionActive: 0
  },

  methods: {
    addSession() {
      addSession(this.properties.robotId).then((res) => {
        if (res.data.code === 200) {
          this.setData({
            sessionActive: 0
          })
          this.triggerEvent('closeMenu')
          this.getSessionList(this.properties.robotId);
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
      deleteSession(this.data.sessionList[data.currentTarget.dataset["index"]].id).then((res) => {
        if (res.data.code === 200) {
          this.getSessionList(this.properties.robotId)
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
    getSessionList(robotId) {
      getSessionList(robotId).then((res) => {
        if (res.data.code === 200) {
          if (isEmpty(res.data.data)) {
            this.addSession();
          } else {
            let sessionList = []
            for (let i = 0; i < res.data.data.length; i++) {
              sessionList.push({
                id: res.data.data[i]["session_id"],
                createTime: res.data.data[i]["created_time"],
                message: isEmpty(res.data.data[i]["message"]) ?
                  null : {
                    id: res.data.data[i]["message"]["message_id"],
                    content: res.data.data[i]["message"]["content"],
                  },
              })
            }
            sessionList.sort(function (o1, o2) {
              return new Date(o2.createTime.replace(/-/g, '/')).getTime() - new Date(o1.createTime.replace(/-/g, '/')).getTime()
            })
            this.setData({
              sessionList: sessionList,
              sessionActive: Math.min(this.data.sessionActive, sessionList.length - 1)
            })
            this.triggerEvent('selectSession', {
              robotId: this.properties.robotId,
              sessionId: this.data.sessionList[this.data.sessionActive].id
            })
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

    selectSession(data) {
      if (data.currentTarget.dataset["index"] !== this.data.sessionActive) {
        this.setData({
          sessionActive: data.currentTarget.dataset["index"],
        })
        this.triggerEvent('closeMenu')
        this.triggerEvent('selectSession', {
          robotId: this.properties.robotId,
          sessionId: this.data.sessionList[this.data.sessionActive].id
        })
      }
    },
  }
})