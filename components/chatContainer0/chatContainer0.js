import TextDecoder from '../../miniprogram/miniprogram-text-decoder'

const {
  isEmpty
} = require("../../utils/common")

const {
  chat,
} = require("../../apis/chat")

Component({
  properties: {
    robotId: {
      type: String,
      value: null,
    },
    robotHandle: {
      type: String,
      value: null
    },
    robotAvatar: {
      type: String,
      value: null
    },
    robotDescription: {
      type: String,
      value: null
    },
    robotPrompts: {
      type: Array,
      value: []
    },
    userAvatar: {
      type: String,
      value: null
    },
    sessionId: {
      type: BigInt,
      value: null
    },
    robotActive: {
      type: Number,
      value: null
    },
    linkFlag: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'robotActive': function (param) {
      this.selectComponent("#messageContainer").scrollToButton()
    }
  },

  data: {
    messageContainerHeight: 0,

    answeringFlag: false,
    answeringContent: "",
  },

  lifetimes: {
    attached: function (e) {
      this.updateMessageContainerHeight()
    }
  },

  methods: {
    chat(data) {
      let requestStream = chat(
        this.properties.robotId,
        this.properties.sessionId,
        this.properties.robotHandle,
        data.detail['input'],
        isEmpty(data.detail['file']) ? null : data.detail['file'].type,
        isEmpty(data.detail['file']) ? null : data.detail['file'].name,
        isEmpty(data.detail['file']) ? null : data.detail['file'].url);

      this.setData({
        answeringFlag: true,
        answeringContent: ""
      })
      this.triggerEvent('setMenuEnabled', false)

      this.selectComponent("#messageContainer").addMessage({
        role: 'user',
        content: data.detail['input'],
      })

      requestStream.onChunkReceived((res) => {
        let arrayBuffer = new Uint8Array(res.data)
        let str = new TextDecoder().decode(arrayBuffer)
        let strs = str.split("\n")

        for (let i = 0; i < strs.length; i++) {
          if (this.data.answeringFlag) {
            if (strs[i].startsWith("event:conversation")) {

            } else if (strs[i].startsWith("event:all")) {
              this.selectComponent("#messageContainer").addMessage({
                role: 'assistant',
                content: this.data.answeringContent,
              })
              this.setData({
                answeringFlag: false,
                answeringContent: null
              })
              this.triggerEvent('setMenuEnabled', true)
            } else if (strs[i].startsWith("event:done")) {} else if (strs[i].startsWith("data:done")) {} else if (strs[i].startsWith("data:")) {
              this.setData({
                answeringContent: (this.data.answeringContent + strs[i].substring(5)).replace(/&#92n/g, '\n').replace(/&#32;/g, ' ')
              })
            } else {
              this.setData({
                answeringContent: (this.data.answeringContent + strs[i]).replace(/&#92n/g, '\n').replace(/&#32;/g, ' ')
              })
            }
          }
        }
      })
    },

    selectLinkRobot() {
      this.triggerEvent('selectLinkRobot')
    },

    updateMessageContainerHeight() {
      let query = wx.createSelectorQuery().in(this);
      query.select('#chatContainer').boundingClientRect();
      query.select('#robotInput').boundingClientRect();
      query.exec((res) => {
        let chatContainerHeight = res[0].height;
        let robotInputHeight = res[1].height;
        this.setData({
          messageContainerHeight: chatContainerHeight - robotInputHeight
        })
      })
    },

    scrollToButton() {
      this.selectComponent("#messageContainer").scrollToButton()
    }
  }
})