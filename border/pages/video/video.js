// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    isHide: '',
    videoList: [],
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var user_id = options.user_id;
    var isHide = options.isHide;
    console.log(options);
    that.setData({
      user_id: user_id,
      isHide: isHide
    })
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getMyVideos?user_id=' + user_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 200) {
          // console.log(res.data.data)
          var list = [];
          for (var i in res.data.data) {
            var time = res.data.data[i].createTime
            var d = new Date(time);
            var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            list[i] = times;
            res.data.data[i].time = times;
          }
          that.setData({
            videoList: res.data.data
          });
          console.log(res.data.data);
        };
      }
    });

  },
  toDetail: function (event) {
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var categoryId = event.currentTarget.dataset.categoryid;
    var that = this;
    var user_id = that.data.user_id;
    wx.navigateTo({
      url: '../details/details?id=' + id + "&categoryId=" + categoryId + "&user_id=" + user_id
    })
  }
})