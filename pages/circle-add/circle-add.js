// pages/circle-add/circle-add.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImgPaths:[],
    imgUrls:[]
  },

  pickImg:function(){
    var that = this;
    wx.chooseImage({
      count: 9-that.data.imgUrls.length,
      success: function (res) {
        var validate = true;
        for (var i = 0; i < res.tempFiles.length;i++){
          var imgFile = res.tempFiles[i];
          if (imgFile.size > 1000 * 500) {
            validate= false;
            break;
          }
        }
        if (!validate){
          //图片文件不超过500KB
          wx.showToast({
            title: '图片过大，换一张嘛',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        
        that.batchUpload(res.tempFilePaths, 0, that.data.imgUrls, that.data.localImgPaths);
      },
    })
  },

  batchUpload: function (filePaths, index, imgUrls, localImgPaths){
    var that = this;
    wx.showLoading({
      title: '上传中' + (index+1) + '/' + filePaths.length,
    });
    wx.uploadFile({
      url: app.globalData.server_url + "/rock-lanmao/upload/uploadPicture.do",
      filePath: filePaths[index],
      name: 'file',
      formData: {
      },
      success: function (res) {
        console.log("uploadPicture success...");
        var data = JSON.parse(res.data);
        console.log("uploadPicture.do data ===" + data);
        imgUrls.push(app.globalData.server_url + data.uri);
        localImgPaths.push(filePaths[index]);
      },
      complete:function(){
        console.log("uploadPicture complete...");
        index++;
        if (index == filePaths.length){
          that.setData({
            imgUrls: imgUrls,
            localImgPaths: localImgPaths,
            hasImg: true
          });
          wx.hideLoading();
        }else{
          that.batchUpload(filePaths, index, imgUrls, localImgPaths);
        }
      }
    });
  },

  setContent:function(e){
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    });
  },

  saveArticle: function () {
    var that = this;
    var util = require("../../utils/location-util.js");
    util.checkDistance(function () {
      that.saveArticleInner();
    }, '在' + app.globalData.homeName + '附近500米内才能发布图片哦');
  },

  saveArticleInner:function(){
    var that = this;
    var content = that.data.content ? that.data.content:'';
    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/article/save.do",
      data: {
        'userId': app.globalData.userInfo.id,
        'content': content,
        'picturePaths[]': that.convertImgUrlsStr(that.data.imgUrls),
        'cuId': app.globalData.cuId
      },
      success: res => {
        console.log("article/save.do res=" + res.data);
        that.setData({
          'hasImg': false
        });
        wx.switchTab({
          url: '../circle/circle'
        })
      }
    });
  },

  convertImgUrlsStr:function(imgUrls){
    var imgUrlsStr = "";
    for (var i = 0; i < imgUrls.length; i++){
      imgUrlsStr += imgUrls[i]+",";
    }
    imgUrlsStr = imgUrlsStr.substring(0, imgUrlsStr.length-1);
    console.log("convertImgUrlsStr==" + imgUrlsStr);
    return imgUrlsStr;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  }
})