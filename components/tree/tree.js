const app = getApp()

Component({
  properties: {
    dataTree: {
      type: Array,
      value: []
    },
    selectKey: {
      type: String,
      value: ''
    },
    isSelectLastNode: {
      type: Boolean,
      value: false
    },
    isOpenAll: {
      type: Boolean,
      value: false
    },
    layer: {
      type: Number,
      value: 1
    }
  },
  observers: {
    'dataTree': function (params) {
      params.forEach(v => {
        v.open = this.properties.isOpenAll // 是否展开
        v.outline.outline_content = app.towxml(v.outline.outline_content, 'markdown')
      })
      this.setData({
        tree: params,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    tree: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isOpen(e) {
      const open = 'tree[' + e.currentTarget.dataset.index + '].open'
      this.setData({
        [open]: !this.data.tree[e.currentTarget.dataset.index].open
      })
    },
    select(e) {
      const item = e.currentTarget.dataset.item
      if (this.properties.isSelectLastNode) {
        if (!item.children || item.children.length == 0) {
          this.triggerEvent('select', {
            item: item
          }, {
            bubbles: true,
            composed: true
          })
        } else {
          this.triggerEvent('select', {
            tips: '必须选择最后一个节点'
          }, {
            bubbles: true,
            composed: true
          })
        }
      } else {
        this.triggerEvent('select', {
          item: item
        }, {
          bubbles: true,
          composed: true
        })
      }
    }
  }
})