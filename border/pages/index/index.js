//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    current: 0, //当前选中的Tab项
    categoryList: [],
    categoryItem: [],
    bannerList: [],
    videoList: [],
    user_id: ''
  },

  onLoad: function () {
    var that = this;
    //获取用户id
    wx.getStorage({
      key: 'useridData',
      success: function (res) {
        var useridData = res.data;
        that.setData({
          user_id: useridData
        });
      }
    });
    //是否登录了
    wx.getStorage({
      key: 'isLogin',
      success: function (res) {
        var isLogin = res.data;
        that.setData({
          isLogin: isLogin
        });
      }
    });
    //获取首页信息
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getIndexInfo',
      success: function (res) {
        if (res.data.status == 200) {
          console.log(res.data.msg)
          var categoryData = res.data.data.categoryList.slice(0, 6)
          var videoData = res.data.data.videoList
          that.setData({
            current: categoryData[0].id,
            categoryList: categoryData,
            categoryItem: res.data.data.categoryList.slice(6, 7),
            bannerList: res.data.data.bannerList,
            videoList: videoData
          })
        }
      },
      fail: function (res) {
        if (res.data.status == 500) {
          console.log(res.data.msg)
        }
      }
    })
  },
  // 导航栏点击添加样式事件
  navItemClick: function (event) {
    this.setData({
      current: event.currentTarget.dataset.pot
    })
  },
  //点击推荐中的图片跳转到视频详情页
  videoClick: function (event) {
    var id = event.currentTarget.dataset.id;
    var categoryId = event.currentTarget.dataset.categoryid;
    var user_id = this.data.user_id;
    wx.navigateTo({
      url: '../details/details?id=' + id + "&categoryId=" + categoryId + "&user_id=" + user_id
    })
  },
  //点击分享
  onShareAppMessage: function (res) {
    //获取id 
    var id = res.target.dataset.id;
    //获取栏目id
    var categoryId = res.target.dataset.categoryId;
    //获取标题 
    var title = res.target.dataset.title;
    //图片 
    var img = res.target.dataset.img;
    if (res.from === 'button') {
      // 来自页面内转发按钮 
      return {
        title: title,
        path: '../details/details?id=' + id + "&categoryId=" + categoryId,
        imageUrl: img
        //不设置则默认为当前页面的截图 
      }
    }
  }

})
