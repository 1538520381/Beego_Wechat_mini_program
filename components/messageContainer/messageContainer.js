const {
  getMessageList,
} = require("../../apis/chat")
const { isEmpty } = require("../../utils/common")

Component({
  properties: {
    robotAvatar: {
      type: String,
      value: null,
    },
    robotDescription: {
      type: String,
      value: null
    },
    userAvatar: {
      type: String,
      value: null
    },
    sessionId: {
      type: BigInt,
      value: null
    },
    answeringFlag: {
      type: Boolean,
      value: null
    },
    answeringContent: {
      type: String,
      value: null
    },
    latexFlag: {
      type: Boolean,
      value: false
    },
    scrollYFlag: {
      type: Boolean,
      value: false
    },
    latexFlag: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'sessionId': function (params) {  
      if(!isEmpty(params) && params != this.data.sessionId0){
        console.log(this.data.sessionId0 + " " + params)
        this.setData({
          sessionId0: params
        })
        this.getMessageList(params)
      }
    },
  },

  data: {
    messageList: [],

    sessionId0: null,

    toView: null
  },

  methods: {
    getMessageList(sessionId) {
      getMessageList(sessionId).then((res) => {
        if (res.data.code === 200) {
          let messageList = []
          for (let i in res.data.data) {
            messageList.push({
              id: res.data.data[i]["message_id"],
              role: res.data.data[i]["role"],
              content: res.data.data[i]["content"],
              fileType: res.data.data[i]["file_type"],
              fileName: res.data.data[i]["file_name"],
              fileUrl: res.data.data[i]["file_url"],
              createTime: res.data.data[i]["created_time"],
            })
          }
          messageList.sort((o1, o2) => {
            return o1.id - o2.id
          })
          this.setData({
            messageList: messageList
          })
          this.scrollToButton()
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

    addMessage(message) {
      let messageList = this.data.messageList
      messageList.push(message);
      this.setData({
        messageList: messageList
      })
    },

    scrollToButton() {
      this.setData({
        toView: 'bottom'
      })
      this.triggerEvent('updateMessageContainerHeight')
    }
  }
})