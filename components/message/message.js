const app = getApp()

const {
  latexToMarkdown
} = require('../../utils/common');

Component({
  properties: {
    robotAvatar: {
      type: String,
      value: null,
    },
    userAvatar: {
      type: String,
      value: null,
    },
    role: {
      type: String,
      value: null
    },
    content: {
      type: String,
      value: null
    },
    latexFlag: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'content': function (param) {
      if (this.data.latexFlag) {
        this.setData({
          contentMarkdown: app.towxml(latexToMarkdown(param), 'markdown')
        })
      } else {
        this.setData({
          contentMarkdown: app.towxml(param, 'markdown')
        })
      }
    }
  },

  data: {
    contentMarkdown: null
  },

  methods: {
    copy(data) {
      wx.setClipboardData({
        data: this.data.latexFlag ? latexToMarkdown(data.currentTarget.dataset.text) : data.currentTarget.dataset.text,
        success: function (res) {}
      })
    }
  }
})