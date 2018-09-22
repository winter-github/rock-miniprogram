//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取控制单元
    that.getControlUnit();

    // 登录
    that.login();
    
  },

  getControlUnit: function(){
    var that = this;
    wx.request({
      url: that.globalData.server_url + "/rock-lanmao/system/getControlUnitById.do",
      data: {
        id: that.globalData.cuId
      },
      success: res => {
        console.log("system/getControlUnitById.do res===" + res.data.controlUnit);
        if (that.getControlUnitReadyCallback) {
          console.log("app call app.getControlUnitReadyCallback");
          that.getControlUnitReadyCallback(res.data.controlUnit);
        }
        that.buildHomeSettings(res.data.controlUnit);
      }
    })
  },

  buildHomeSettings: function (controlUnit){
    var that = this;
    that.globalData.homeName = controlUnit.name;
    that.globalData.homeLat = controlUnit.lat;
    that.globalData.homeLng = controlUnit.lng;
    that.globalData.homeCoverImg = controlUnit.coverImg;
    that.globalData.enableCheckDistance = controlUnit.enableCheckDistance==1;
    console.log(JSON.stringify(that.globalData));
  },

  login: function(){
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.server_url + "/rock-lanmao/user/login.do",
          data: {
            token: res.code
          },
          success: res => {
            console.log("user/login.do res===" + res.data.user);
            var user = res.data.user;
            that.globalData.userInfo = { 'id': user.id, 'openId': user.openId };

            if (that.userInfoReadyCallback) {
              console.log("app call app.userInfoReadyCallback");
              that.userInfoReadyCallback(res);
            }

            if (that.userInfoReadyCallback1) {
              console.log("app call app.userInfoReadyCallback1");
              that.userInfoReadyCallback1(res);
            }

            //that.getWxSetting();
          }
        })
      }
    });
  },

  getWxSetting:function(){
    var that = this;
    wx.getSetting({
      success: res => {
        console.log("wx.getSetting=" + res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权用户信息");
          wx.getUserInfo({
            success: function (res) {
              that.syncUserInfo(res);
            }
          });

        } else {
          console.log("没有授权");
        }
      }
    })
  },

  syncUserInfo:function(e){
    console.log("app.syncUserInfo");
    var that = this;
    var user = e.userInfo;
    //用户头像、昵称放入全局数据
    that.globalData.userInfo.nickName = user.nickName;
    that.globalData.userInfo.headImgUrl = user.avatarUrl;
    //同步用户数据
    wx.request({
      url: that.globalData.server_url + "/rock-lanmao/user/syncUserInfo.do",
      data: {
        id: that.globalData.userInfo.id,
        openId: that.globalData.userInfo.openId,
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

  globalData: {
    server_url:'https://www.rockyueyang.com',
    cuId: 1,
    homeName:'懒猫咖啡',
    homeLat: 29.357347,
    homeLng: 113.133537,
    homeCoverImg: null,
    enableCheckDistance:false,
    userInfo: {}
  }
})