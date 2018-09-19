//获取应用实例
const app = getApp();

Page({
    data: {
        banner : '/images/c1.png',
        goodsList: [],
        pageNum: 1,
        totalPage: 0,
        curIndex: 0,
        isScroll: false,
        articleId: null,
        receiveUserId : null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log("load options.articleId=" + options.articleId + ", options.receiveUserId=" + options.receiveUserId);
      this.setData({
        articleId: options.articleId,
        receiveUserId: options.receiveUserId
      });

      this.goodsList();
    },

    goodsList: function () {
      var that = this;
      
      wx.request({
        url: app.globalData.server_url + "/rock-lanmao/goods/list.do",
        data: {
          'pageNum': that.data.pageNum,
          'cuId': app.globalData.cuId
        },
        success: res => {
          console.log("goods/list.do res=" + res.data);
          var records = res.data.records;
          that.setData({
            goodsList: records,
            totalPage: res.data.totalPage
          });
        }
      });
    },

    buyGift:function(e){
      var that = this;
      console.log("dataset==" + e.currentTarget.dataset);
      var goodsId = e.currentTarget.dataset.goodsId;
      var price = e.currentTarget.dataset.price;
      console.log("goodsId=" + goodsId + ",price=" + price);
      wx.request({
        url: app.globalData.server_url + "/rock-lanmao/order/addOrder.do",
        data: {
          'type': 'GIFT_CARD',
          'userId': app.globalData.userInfo.id,
          'relationId': goodsId,
          'relationSecondId': that.data.articleId,
          'relationThirdId': that.data.receiveUserId,
          'buyCount':1,
          'originalPrice': price,
          'payAmount': price,
          'cuId': app.globalData.cuId
        },
        success: res => {
          console.log("order/addOrder.do res.data.orderId=" + res.data.orderId);
          that.pay(res.data.orderId);
        }
      });
    },

    pay:function(orderId){
      wx.request({
        url: app.globalData.server_url + "/rock-lanmao/order/payOrder.do",
        data: {
          'orderId': orderId
        },
        success: res => {
          console.log("order/payOrder.do res=" + res.data);
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.showModal({
                title: '赠送成功',
                content: 'TA已收到你赠送的礼物，TA可以在小程序底部"我的"页签中查看礼物。',
                confirmColor: '#d4237a',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            },
            'fail': function (res) {
            }
          });
        }
      });
    }
})