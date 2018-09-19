//获取应用实例
const app = getApp();

Page({
  data: {
    giftList: [],
    pageNum: 1,
    totalPage: 0
  },

  /**
     * 页面相关事件处理函数--页面加载
     */
  onLoad: function () {
    //var that = this;
    //that.giftList(1);
  },

  onShow: function () {
    this.giftList(1);
  },

  giftList: function (pageNum) {
    console.log("giftList pageNum===" + pageNum + ", userId=" + app.globalData.userInfo.id);

    wx.showLoading({
      title: '加载中',
    });

    var that = this;
    that.setData({
      pageNum: pageNum
    });

    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/giftCard/selectMyGiftCardList.do",
      data: {
        'userId': app.globalData.userInfo.id,
        'pageNum': pageNum
      },
      success: res => {
        console.log("giftCard/selectMyGiftCardList.do res=" + res.data);
        var records = res.data.records;
        if (pageNum > 1) {
          records = that.data.giftList.concat(records);
        }
        that.setData({
          giftList: records
          //totalPage: res.data.totalPage
        });

        wx.hideLoading();
      }
    });
  },

  viewCode:function(e){
    var code = e.target.dataset.code;
    wx.showModal({
      title: '密码',
      content: code,
      confirmColor:'#d4237a',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }

});