//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    coverImage:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525890515041&di=b3a084f0bb10c4bde79f742ebc04dee6&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbainuo%2Fcrop%3D0%2C0%2C1000%2C562%3Bw%3D690%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95%2Fsign%3D159cd5fe9745d688b74de8e499f2512e%2F1f178a82b9014a9020625a70ac773912b21bee9b.jpg',
    motto: 'welcome to LanMao cafe !',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525890515041&di=b3a084f0bb10c4bde79f742ebc04dee6&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbainuo%2Fcrop%3D0%2C0%2C1000%2C562%3Bw%3D690%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95%2Fsign%3D159cd5fe9745d688b74de8e499f2512e%2F1f178a82b9014a9020625a70ac773912b21bee9b.jpg',
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3435919196,2847026846&fm=15&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=97975023,875166470&fm=15&gp=0.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log("onload app.globalData.userInfo="+app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
        //hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("callback app.globalData.userInfo=" + app.globalData.userInfo.openId)
        this.setData({
          userInfo: app.globalData.userInfo
          //hasUserInfo: true
        })
      }
    } else {
      //在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log("get after app.globalData.userInfo=" + app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
