// pages/mine/mine.js
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,//判断是否登录状态
    userInfo: [],
    code: '',
    user_id: '',
    openid: '',
    sum: ''
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.setStorage({//将请求成功的数据异步存储到本地
                key: 'userInfo',
                data: res.userInfo
              });
              that.setData({
                userInfo: res.userInfo
              });
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  // console.log("用户的code:" + res.code);
                  that.setData({
                    code: res.code
                  })
                  wx.setStorage({//将请求成功的数据异步存储到本地
                    key: 'codeData',
                    data: res.code
                  });
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'https://www.qifanlee.top:8412/api/v1/login',
                    data: {
                      code: res.code,
                      userHead: that.data.userInfo.avatarUrl,
                      userName: that.data.userInfo.nickName,
                      userGender: that.data.userInfo.gender,
                      userCity: that.data.userInfo.city,
                      userProvince: that.data.userInfo.province
                    },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    success: res => {
                      console.log(res.data.msg)
                      // 获取到用户的 openid
                      // console.log("用户的openid:" + res.data.data.open_id);
                      // console.log("用户的session_key:" + res.data.data.session_key);
                      // console.log("用户的id:" + res.data.data.user_id);
                      wx.setStorage({//将请求成功的数据异步存储到本地
                        key: 'openidData',
                        data: res.data.data.open_id
                      });
                      wx.setStorage({//将请求成功的数据异步存储到本地
                        key: 'useridData',
                        data: res.data.data.user_id
                      });
                      //改变isHide 的值,显示登录
                      that.setData({
                        isHide: true,
                        user_id: res.data.data.user_id,
                        openid: res.data.data.open_id
                      });
                      wx.setStorage({//将请求成功的数据异步存储到本地
                        key: 'isLogin',
                        data: that.data.isHide
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // isHide 的值不变
          wx.setStorage({//将请求成功的数据异步存储到本地
            key: 'isLogin',
            data: that.data.isHide
          });
        }
      }
    });
  },

  onShow: function () {
    var that = this;
    var openid = wx.getStorageSync('openidData');
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
          console.log(res.data);
          var newCommentNum = 0;
          for (var i in res.data.data) {
            newCommentNum += parseInt(res.data.data[i].newCommentNum);
          };
          var newReplyNum = 0;
          for (var j in res.data.data) {
            newReplyNum += parseInt(res.data.data[j].newReplyNum);
          }
          var sum = newReplyNum + newCommentNum;
          that.setData({
            sum: sum
          })
          console.log('sum' + sum);
        };
      },
    });
  },
  // 点击登录按钮
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮后获取code
      wx.login({
        success: function (res) {
          console.log(res.code);
          wx.setStorage({//将请求成功的数据异步存储到本地
            key: 'codeData',
            data: res.code
          });
          wx.request({
            // 自行补上自己的 APPID 和 SECRET
            url: 'https://www.qifanlee.top:8412/api/v1/login',
            data: {
              code: res.code,
              userHead: that.data.userInfo.avatarUrl,
              userName: that.data.userInfo.nickName,
              userGender: that.data.userInfo.gender,
              userCity: that.data.userInfo.city,
              userProvince: that.data.userInfo.province
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: res => {
              console.log(res.data.msg)
              // 获取到用户的 openid
              // console.log("用户的openid:" + res.data.data.open_id);
              // console.log("用户的session_key:" + res.data.data.session_key);
              // console.log("用户的id:" + res.data.data.user_id);
              wx.setStorage({//将请求成功的数据异步存储到本地
                key: 'openidData',
                data: res.data.data.open_id
              });
              wx.setStorage({//将请求成功的数据异步存储到本地
                key: 'useridData',
                data: res.data.data.user_id
              });
              that.setData({
                user_id: res.data.data.user_id,
                openid: res.data.data.open_id
              })
            }
          });
        }
      });
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      wx.setStorage({//将请求成功的数据异步存储到本地
        key: 'userInfo',
        data: e.detail.userInfo
      });
      that.setData({
        userInfo: e.detail.userInfo
      });
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: true
      });
      wx.setStorage({//将请求成功的数据异步存储到本地
        key: 'isLogin',
        data: that.data.isHide
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法正常使用小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },


})