// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = options.user_id;
    var that = this;
    that.setData({
      user_id: user_id
    });
    //获取我的收藏
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getCollects',
      data: {
        user_id: user_id
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log("获取视频详情：" + res.data.msg);
          that.setData({
            collectList: res.data.data,
          });
        }
      },
    });
  },

})