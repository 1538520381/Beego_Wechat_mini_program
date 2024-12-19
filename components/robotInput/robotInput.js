const CONFIG = require('../../config')

const {
  isEmpty,
} = require('../../utils/common')

Component({
  properties: {
    robotPrompts: {
      type: Array,
      value: []
    },
    linkFlag: {
      type: Boolean,
      value: false
    }
  },

  data: {
    input: "",
    file: {},
  },

  methods: {
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
          _this.triggerEvent('updateMessageContainerHeight')
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
        file: null,
      })
      this.triggerEvent('updateMessageContainerHeight')
    },

    selectPrompt(data) {
      this.setData({
        input: data.currentTarget.dataset["input"]
      }, function () {
        this.triggerEvent('updateMessageContainerHeight')
      })
    },

    chat() {
      if (isEmpty(this.data.input) && isEmpty(this.data.file)) {
        return
      }

      this.triggerEvent('chat', {
        input: this.data.input,
        file: this.data.file
      })

      this.setData({
        input: null,
        file: null
      })
    },

    selectLinkRobot(){
      this.triggerEvent('selectLinkRobot')
    },

    scrollToBottom(){
      this.triggerEvent('scrollToButton')
    },

    input(e) {
      this.setData({
        input: e.detail.value
      })
      this.triggerEvent('updateMessageContainerHeight')
    },
  }
})