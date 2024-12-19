Component({
  properties: {
    fileName: {
      type: String,
      value: null,
    },
    fileType: {
      type: String,
      value: null
    },
    fileUrl: {
      type: String,
      value: null,
    }
  },

  data: {
    constants: {
      imageType: ['jpg', 'png'],
      fileTypeIconDict: {
        'pdf': 'pdf',
        'doc': 'word',
        'docx': 'word',
        'txt': 'txt',
      }
    }
  },

  methods: {
    removeFile(){
      this.triggerEvent('removeFile')
    }
  }
})