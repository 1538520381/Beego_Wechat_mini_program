const {
  getRobotById
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
    linkRobotId: {
      type: BigInt,
      value: null,
    },
    linkRobotHandle: {
      type: String,
      value: null
    },
    linkRobotAvatar: {
      type: String,
      value: null
    },
    linkRobotDescription: {
      type: String,
      value: null
    },
    linkRobotPrompts: {
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
    linkSessionId: {
      type: BigInt,
      value: null
    },
    robotActive: {
      type: Number,
      value: null
    },
    linkRobotFlag: {
      type: Boolean,
      value: false
    }
  },

  data: {
  },

  observers: {
    'linkRobotFlag': function (param) {
      console.log(this.data.linkRobotDescription)
    }
  },

  methods: {
    selectLinkRobot() {
      this.triggerEvent('selectLinkRobot')
      // this.selectComponent("#chatContainer").updateMessageContainerHeight()
    },
  }
})