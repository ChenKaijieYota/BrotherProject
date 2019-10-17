// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    user_id: '',
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    });
    var openid = options.openid;
    var user_id = options.user_id;
    var that = this;
    that.setData({
      openid: openid,
      user_id: user_id
    })
    //获取我的评论信息
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getMyComments',
      data: {
        open_id: openid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log("我的评论：" + res.data.msg);
          console.log(res);
          that.setData({
            commentList: res.data.data
          });
        };
      },
    });
  },

  toDetailUrl: function (event) {
    var id = event.currentTarget.dataset.id;
    var categoryId = event.currentTarget.dataset.categoryid;
    var videoId = event.currentTarget.dataset.videoid;
    var that = this;
    var user_id = that.data.user_id;
    // 更新评论的查阅状态
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/upLookStatus',
      data: {
        video_id: videoId,
        user_id: user_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log("点击阅读评论：" + res.data.msg);
        };
      },
    });

    wx.navigateTo({
      url: '../details/details?id=' + id + '&categoryId=' + categoryId + '&user_id=' + user_id
    });

    //刷新页面
    that.onLoad(that.data.options);



    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.onLoad()
    }
  },


})