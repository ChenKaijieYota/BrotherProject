// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_text: '',//搜索的内容
    search_content: [],//搜索成功返回的内容
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id = options.user_id;
    var that = this;
    that.setData({
      user_id: user_id
    })
  },

  //获取评论者当前写的评论
  getSearchText: function (event) {
    var search_text = event.detail.value;//想要发布的评论
    this.setData({
      search_text: search_text
    });
  },
  // 点击搜索
  sendSearch: function () {
    var that = this;
    var search_text = that.data.search_text;
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/toSearch',
      data: {
        keyword: search_text,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log(res.data.msg)
          console.log(res.data)
          that.setData({
            search_content: res.data.data
          })
        }
      }
    });
  }

})