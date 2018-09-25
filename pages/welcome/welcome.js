// pages/welcome/welcome.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImg: null,
    coverTitle: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("app.globalData.homeCoverImg=" + app.globalData.homeCoverImg + ", app.globalData.homeCoverTitle=" + app.globalData.homeCoverTitle);
    if (app.globalData.homeCoverImg == null 
          || app.globalData.homeCoverTitle == null) {
      app.getControlUnitReadyCallback = res => {
        that.setData({
          coverImg: app.globalData.homeCoverImg,
          coverTitle: app.globalData.homeCoverTitle
        });
      }
    }else{
      that.setData({
        coverImg: app.globalData.homeCoverImg,
        coverTitle: app.globalData.homeCoverTitle
      });
    }
  },

  onGotUserInfo: function (res) {
    var that = this;
    wx.showLoading({
      title: '路线导航中...',
    });
    var user = res.detail.userInfo;
    //用户头像、昵称放入全局数据
    app.globalData.userInfo.nickName = user.nickName;
    app.globalData.userInfo.headImgUrl = user.avatarUrl;

    //同步用户数据
    if (!app.globalData.userInfo.id){
      console.log("welcome set app.userInfoReadyCallback");
      app.userInfoReadyCallback = res => {
        that.syncUserInfo(user);
      }
    }else{
      that.syncUserInfo(user);
    }
    
    wx.switchTab({
      url: '../circle/circle'
    })
  },

  syncUserInfo:function(user){
    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/user/syncUserInfo.do",
      data: {
        id: app.globalData.userInfo.id,
        openId: app.globalData.userInfo.openId,
        headImgUrl: user.avatarUrl,
        nickName: user.nickName,
        gender: user.gender,
        city: user.city,
        province: user.province,
        country: user.country
      },
      success: res => {
        console.log("user/syncUserInfo.do res===" + res.data);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})