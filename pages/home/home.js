const {
  sleep
} = require("../../utils/common");

const {
  login,
  getUserByToken
} = require("../../apis/user")

Page({
  data: {
    chats: [
      "查询常见的机器学习算法",
      "解释第一类错误是什么意思",
      "写一篇以文化多元化为主题的调研报告"
    ],
    chatIndex: 0,
    chatLen: 2,
    chatMessage: "我可以帮你",
    chatClock: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.createChatClock1();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // const query = wx.createSelectorQuery();
    // query.select('#bubbleCanvas').node().exec((res) => {
    //   console.log(res)
    //   // 获取设备窗口的宽高
    //   const sysInfo = wx.getSystemInfoSync();
    //   const screenWidth = sysInfo.windowWidth;
    //   const screenHeight = sysInfo.windowHeight;

    //   // 计算Canvas的实际宽高
    //   const canvasWidth = screenWidth;
    //   const canvasHeight = screenHeight;

    //   const canvas = res[0].node;
    //   // 设置Canvas的宽高属性
    //   canvas.width = canvasWidth;
    //   canvas.height = canvasHeight;

    //   const ctx = canvas.getContext('2d');

    //   const bubbles = []; // 存储气泡信息的数组
    //   const numBubbles = 24; // 气泡数量

    //   // 初始化气泡信息
    //   for (let i = 0; i < numBubbles; i++) {
    //     bubbles.push({
    //       x: Math.random() * canvas.width, // x坐标
    //       y: Math.random() * canvas.height, // y坐标
    //       radius: Math.random() * canvasWidth * 0.05, // 半径
    //       speed: Math.random() * 0.2 + 0.3, // 速度
    //       color: `rgba(46, 204, 113, 0.3)` // 颜色，绿色透明
    //     });
    //   }

    //   // 绘制气泡
    //   const drawBubbles = () => {
    //     ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 清除画布
    //     for (let i = 0; i < numBubbles; i++) {
    //       ctx.beginPath();
    //       ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, Math.PI * 2);
    //       ctx.fillStyle = bubbles[i].color;
    //       ctx.fill();
    //       ctx.closePath();
    //       ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)'; // 设置描边颜色为黑色
    //       ctx.lineWidth = 1; // 设置描边线宽
    //       ctx.stroke(); // 绘制描边
    //       ctx.closePath();

    //       // 更新气泡位置
    //       bubbles[i].y -= bubbles[i].speed;

    //       // 如果气泡超出画布顶部，重新放置到底部
    //       if (bubbles[i].y < -bubbles[i].radius) {
    //         bubbles[i].x = Math.random() * canvas.width;
    //         bubbles[i].y = canvas.height + bubbles[i].radius;
    //       }
    //     }
    //     canvas.requestAnimationFrame(drawBubbles); // 使用requestAnimationFrame进行动画循环
    //   };
    //   drawBubbles(); // 开始绘制气泡
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getUserByToken() {
    getUserByToken().then((res) => {
      if (res.data.code === 200) {
        wx.switchTab({
          url: '/pages/workbench/workbench'
        })
      } else if (res.data.code === 501) {
        wx.redirectTo({
          url: '/pages/personalInformation/personalInformation',
        })
      } else {
        wx.showToast({
          title: res.data.message,
          duration: 1000,
          icon: 'error',
          mask: true
        })
      }
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: "系统异常，请联系管理员",
        duration: 1000,
        icon: 'error',
        mask: true
      })
    })
  },
  login(e) {
    wx.login({
      success: (res) => {
        if (res.code) {
          login(e.detail.code, res.code).then((res) => {
            if (res.data.code === 200) {
              wx.setStorageSync('token', res.data.data.token)
              this.getUserByToken()
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 1000,
                icon: 'error',
                mask: true
              })
            }
          }).catch((err) => {
            this.setData({
              error: JSON.stringify(err)
            })
            wx.showToast({
              title: "系统异常，请联系管理员",
              duration: 1000,
              icon: 'error',
              mask: true
            })
          })
        }
      },
    })
  },
  login1(){
    this.getUserByToken()
  },

  createChatClock1() {
    this.data.chatClock = setInterval(async () => {
      this.data.chatLen++;
      this.setData({
        chatMessage: "我可以帮你" + this.data.chats[this.data.chatIndex].substring(0, this.data.chatLen) + "|"
      })
      if (this.data.chatLen > this.data.chats[this.data.chatIndex].length) {
        clearInterval(this.data.chatClock);
        await sleep(800);
        this.createChatClock2();
      }
    }, 100)
  },
  createChatClock2() {
    this.data.chatClock = setInterval(async () => {
      this.data.chatLen--;
      this.setData({
        chatMessage: "我可以帮你" + this.data.chats[this.data.chatIndex].substring(0, this.data.chatLen) + "|"
      })
      if (this.data.chatLen === 0) {
        clearInterval(this.data.chatClock);
        this.data.chatIndex = (this.data.chatIndex + 1) % this.data.chats.length
        this.createChatClock1();
      }
    }, 100)
  },
})