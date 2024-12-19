const app = getApp()

const CONFIG = require('../../config');

import TextDecoder from '../../miniprogram/miniprogram-text-decoder'

const {
  isEmpty,
  latexToMarkdown
} = require('../../utils/common');

const {
  chat,
} = require("../../apis/chat");

Component({
  properties: {
    robotId: {
      type: BigInt,
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
    userAvatar: {
      type: String,
      value: null
    },
    sessionId: {
      type: BigInt,
      value: null,
    },
  },

  data: {
    file: {},

    questionFlag: false,
    questionContent: null,
    questionContentMarkdown: null,

    answeringFlag: false,
    answeringContent: null,
  },

  methods: {
    imageRecognition(data) {
      if (isEmpty(data.currentTarget.dataset['file'])) {
        return
      }

      if (this.questionFlag || this.answeringFlag) {
        return
      }

      let requestStream = chat(
        this.properties.robotId,
        null,
        this.properties.robotHandle,
        null,
        data.currentTarget.dataset['file'].type,
        data.currentTarget.dataset['file'].name,
        data.currentTarget.dataset['file'].url);

      this.setData({
        questionFlag: true,
        questionContent: "",
        questionContentMarkdown: null
      })

      requestStream.onChunkReceived((res) => {
        let arrayBuffer = new Uint8Array(res.data)
        let str = new TextDecoder().decode(arrayBuffer)
        let strs = str.split("\n")

        for (let i = 0; i < strs.length; i++) {
          if (this.data.questionFlag) {
            if (strs[i].startsWith("event:conversation")) {

            } else if (strs[i].startsWith("event:all")) {
              this.setData({
                questionFlag: false,
                questionContent: latexToMarkdown(this.data.questionContent)
              })
              this.setData({
                questionContentMarkdown: app.towxml(this.data.questionContent, 'markdown')
              })
            } else if (strs[i].startsWith("event:done")) {} else if (strs[i].startsWith("data:done")) {} else if (strs[i].startsWith("data:")) {
              this.setData({
                questionContent: (this.data.questionContent + strs[i].substring(5)).replace(/&#92n/g, '\n').replace(/&#32;/g, ' ')
              })
            } else {
              this.setData({
                questionContent: (this.data.questionContent + strs[i]).replace(/&#92n/g, '\n').replace(/&#32;/g, ' ')
              })
            }
          }
        }
      })
    },
    problemSolve(data) {
      console.log(data)
      if (isEmpty(data.currentTarget.dataset['question'])) {
        return
      }

      if (this.questionFlag || this.answeringFlag) {
        return
      }

      let requestStream = chat(
        this.properties.robotId,
        this.properties.sessionId,
        1,
        data.currentTarget.dataset['question'],
        null,
        null,
        null);

      this.setData({
        answeringFlag: true,
        answeringContent: "",
      })

      this.selectComponent("#messageContainer").addMessage({
        role: 'user',
        content: data.currentTarget.dataset['question'],
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
              name: res.data.data['file_name'],
              type: res.data.data['file_type'],
              url: res.data.data['file_url']
            }
          })
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

    inputQuestion(e) {
      this.setData({
        questionContent: e.detail.value,
        questionContentMarkdown: app.towxml(e.detail.value, 'markdown')
      })
      console.log(this.data.questionContent)
    },
  }
})