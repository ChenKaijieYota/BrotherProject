// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    isHide: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var isHide = options.isHide;
    that.setData({
      isHide: isHide
    })
    //获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userInfo = res.data;
        that.setData({
          userInfo: userInfo
        });
      }
    });

  }
})