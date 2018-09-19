//获取应用实例
const app = getApp();
var noRefreshFlag = false;

Page({
  data: {
    articleList:[],
    pageNum: 1,
    totalPage: 0,
    scrollTop : 0,
    showDialog: false,
    defaultCommentContent: '写下您的评论',
    clickedIdx: -1,
    clickedCidx: -1
  },

  /**
   * 页面相关事件处理函数--页面加载
   */
  onLoad: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });  

    //that.articleList(1);
  },

  onShow: function () {
    if(!noRefreshFlag){
      this.articleList(1);
      var top = this.data.scrollTop;
      this.setData({
        scrollTop: top == 0 ? 1 : 0
      });
    }
    noRefreshFlag = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.articleList(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--分享页面
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你暗恋的小姐姐在懒猫咖啡，快来请她喝咖啡',
      path: '/pages/circle/circle'
    }
  },

  /////////////以下自定义函数////////////
  scrollToupper:function(){
    wx.startPullDownRefresh();
  },

  scrollTolower:function(){
    var that = this;

    if (that.data.pageNum >= that.data.totalPage){
      wx.showToast({
        title: '已经没有更多内容了',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '加载中',
    });

    that.articleList(that.data.pageNum + 1);
  },

  articleList: function (pageNum){
    console.log("articleList pageNum===" + pageNum + ", userId=" + app.globalData.userInfo.id);

    var that = this;
    if (!app.globalData.userInfo.id){
      app.userInfoReadyCallback1 = res => {
        that.articleList(pageNum);
      }
      return;
    }
    
    that.setData({
      pageNum: pageNum
    });
    
    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/article/list.do",
      data: {
        'userId': app.globalData.userInfo.id,
        'pageNum': pageNum
      },
      success: res => {
        console.log("article/list.do res=" + res.data);
        var records = res.data.records;
        if (pageNum > 1){
          records = that.data.articleList.concat(records);
          wx.hideLoading();
        }
        that.setData({
          articleList: records,
          totalPage: res.data.totalPage
        });
      }
    });
  },

  prevImg:function(e){
    var that = this;
    var uri = e.target.dataset.uri;
    var idx = e.target.dataset.idx;
    var pictures = that.data.articleList[idx].pictures;
    var urls = [];
    for (var i = 0; i < pictures.length; i++){
      urls.push(pictures[i].path);
    }
    console.log("urls=" + urls);
    wx.previewImage({
      //current: uri, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    });
    noRefreshFlag = true;
  },

  setNoRefresh:function(){
    noRefreshFlag = true;
  },

  agree:function(e){
    var that = this;
    var idx = e.target.dataset.idx;
    var articleId = e.target.dataset.articleId;
    var articleList = that.data.articleList[idx];

    let userIsAgree = "articleList[" + idx + "].userIsAgree";
    let agreeCount = "articleList[" + idx + "].agreeCount";

    that.setData({
      [userIsAgree]: 1,
      [agreeCount]: that.data.articleList[idx].agreeCount+1
    });

    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/article/agree.do",
      data: {
        'userId': app.globalData.userInfo.id,
        'articleId': articleId
      },
      success: res => {
        console.log("article/agree.do res=" + res.data);
      }
    });
  },

  //打开评论弹出层
  toggleDialogHandle: function (e) {
    this.showDialog = !this.showDialog;
    if(!this.showDialog){
      this.setData({
        clickedIdx: -1,
        clickedCidx: -1
      });
    }
    this.setData({
      showDialog: this.showDialog
    })
  },

  openTargetComment:function(e){
    var targetUserId = e.currentTarget.dataset.userId;
    if (targetUserId == app.globalData.userInfo.id){
      this.deleteComment(e);
      return;
    }
    this.openComment(e);
  },

  openComment:function(e){
    var that = this;
    var util = require("../../utils/location-util.js");
    util.checkDistance(function(){
      that.openCommentInner(e);
    }, '在' + app.globalData.homeName + '附近500米内才能评论哦');
  },

  openCommentInner:function(e){
    var idx = e.currentTarget.dataset.idx;
    var articleId = e.currentTarget.dataset.articleId;
    var targetCommentId = e.currentTarget.dataset.commentId;
    var targetUserId = e.currentTarget.dataset.userId;
    var targetNickName = e.currentTarget.dataset.nickName;

    console.log("openComment targetCommentId=" + targetCommentId  +",targetNickName=" + targetNickName);
    
    this.setData({
      commentContent: null,
      // targetCommentId: "",
      // targetUserId: null,
      // targetNickName: null,
      defaultCommentContent: '写下您的评论'
    });

    if (targetCommentId){
      var cidx = e.currentTarget.dataset.cidx;
      this.setData({
        clickedIdx: idx,
        clickedCidx: cidx,
        defaultCommentContent: '回复' + targetNickName
      });
    }

    this.setData({
      commentArticleIdx: idx,
      commentArticleId: articleId,
      targetCommentId: targetCommentId ? targetCommentId:"",
      targetUserId: targetUserId ? targetUserId : null,
      targetNickName: targetNickName ? targetNickName : null
    });

    this.toggleDialogHandle();
  },

  setCommentContent:function(e){
    this.setData({
      commentContent: e.detail.value
    });
  },

  saveComment:function(){
    var that = this;
    var idx = that.data.commentArticleIdx;
    var articleId = that.data.commentArticleId;
    var targetUserId = that.data.targetUserId;
    var targetCommentId = that.data.targetCommentId;
    var targetNickName = that.data.targetNickName;
    var content = that.data.commentContent;
    var comments = that.data.articleList[idx].comments;

    console.log("savecomment targetCommentId=" + targetCommentId +",targetNickName=" + targetNickName + ",content=" + content);
    
    if(!content){
      wx.showToast({
        title: '请填写评论内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    var targetComment = null;
    if (targetNickName) {
      targetComment = {
        user: {
          id: targetUserId,
          nickName: targetNickName
        }
      }
    }

    console.log("savecomment targetComment=" + targetComment);

    if (!comments){
      comments = new Array();
    }
    var newComment = { 
      user: 
      { 
        id: app.globalData.userInfo.id,
        headImgUrl: app.globalData.userInfo.headImgUrl, 
        nickName: app.globalData.userInfo.nickName}, 
      content: content,
      targetComment: targetComment
    };
    comments.push(newComment);

    let commentCount = "articleList[" + idx + "].commentCount";
    let articleComments = "articleList[" + idx + "].comments";

    that.setData({
      [commentCount]: that.data.articleList[idx].commentCount + 1,
      [articleComments]: comments
    });

    that.toggleDialogHandle();
    
    wx.request({
      url: app.globalData.server_url + "/rock-lanmao/article/comment/save.do",
      method:'POST',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data: {
        'userId': app.globalData.userInfo.id,
        'articleId': articleId,
        'targetCommentId': targetCommentId,
        'content': content
      },
      success: res => {
        console.log("comment/save.do res=" + res.data);
      }
    });
  },

  deleteComment:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var cidx = e.currentTarget.dataset.cidx;
    that.setData({
      clickedIdx: idx,
      clickedCidx: cidx
    });

    wx.showModal({
      title: '提示',
      content: '确认删除你的评论吗？',
      success: function (res) {
        if (res.confirm) {
          var targetCommentId = e.currentTarget.dataset.commentId;
          var comments = that.data.articleList[idx].comments;
          comments.splice(cidx,1);
          console.log("deletecomment cidx=" + cidx);

          let commentCount = "articleList[" + idx + "].commentCount";
          let articleComments = "articleList[" + idx + "].comments";

          that.setData({
            [commentCount]: that.data.articleList[idx].commentCount - 1,
            [articleComments]: comments
          });
          console.log(app.globalData.server_url + "/rock-lanmao/article/comment/delete.do?commentId=" + targetCommentId);
          wx.request({
            url: app.globalData.server_url + "/rock-lanmao/article/comment/delete.do?commentId=" + targetCommentId,
            method: 'GET',
            success: res => {
              console.log("comment/delete.do res=" + res.data.status);
            }
          });
        } else if (res.cancel) {
          console.log('取消删除评论');
        }

        that.setData({
          clickedIdx: -1,
          clickedCidx: -1
        });
      }
    });
  }
})
