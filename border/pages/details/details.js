// pages/details/details.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],//用户信息
    user_id: '',//用户id
    isLogin: '',//判断用户是否登录
    title: '',//视频标题
    publishTime: '',//发布时间
    watchNum: '',//观看量
    likeNum: '',//视频点赞量
    playerUrl: '',//视频url
    collectTag: false,//视频是否收藏，true为还没收藏
    guessLikeList: [],//猜你喜欢列表
    video_id: null,//视频id
    category_id: null,//栏目id
    isLike: '',//判断是否有点赞,true表示有
    commentUser: [],//每个评论者的信息
    comment_text: '',//当前在input输入的评论信息
    setMessage: '',
    replyName: '',//被回复者的昵称
    replyId: '',//被回复者的id
    replyPid: '',//回复所属的评论id
    placeholder: '请写下您的评论',//placeholder的值
    commentNum: '',//视频下的评论数
    currentId: '',
    replyInfoList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*存起来，刷新后可以展示*/
    this.setData({
      options: options
    });
    var video_id = options.id;
    var category_id = options.categoryId;
    var user_id = options.user_id;
    var that = this;
    that.setData({
      video_id: video_id,
      category_id: category_id,
      user_id: user_id
    });

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

    //3、观看量增加 接口
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/addWatchNum?id=' + video_id,
      method: 'POST',
      fail: function (res) {
        if (res.data.status == 500) {
          console.log("视频观看量：" + res.data.msg)
        }
      }
    });

    //2、获取视频详情 接口
    if (user_id == '') {
      wx.request({
        url: 'https://www.qifanlee.top:8412/api/v1/getVideoDetail?video_id=' + video_id + "&category_id=" + category_id,
        success: function (res) {
          if (res.data.status == 200) {
            console.log("获取视频详情：" + res.data.msg);
            that.setData({
              title: res.data.data.videoInfo.title,//视频标题
              publishTime: res.data.data.videoInfo.publishTime,//发布时间
              watchNum: res.data.data.videoInfo.watchNum,//视频观看量
              likeNum: res.data.data.videoInfo.likeNum,//视频点赞量
              guessLikeList: res.data.data.guessLikeList,//猜你喜欢模块信息
              playerUrl: res.data.data.videoInfo.playerUrl,//视频url
              collectTag: res.data.data.videoInfo.collectTag//视频是否收藏
            });
            console.log('未登录的收藏' + res.data.data.videoInfo.collectTag);
          }
        },
        fail: function (res) {
          if (res.data.status == 500) {
            console.log(res.data.msg)
          }
        }
      });
    } else {
      wx.request({
        url: 'https://www.qifanlee.top:8412/api/v1/getVideoDetail',
        data: {
          video_id: video_id,
          category_id: category_id,
          user_id: user_id
        },
        success: function (res) {
          if (res.data.status == 200) {
            console.log("获取视频详情：" + res.data.msg);
            that.setData({
              title: res.data.data.videoInfo.title,//视频标题
              publishTime: res.data.data.videoInfo.publishTime,//发布时间
              watchNum: res.data.data.videoInfo.watchNum,//视频观看量
              likeNum: res.data.data.videoInfo.likeNum,//视频点赞量
              guessLikeList: res.data.data.guessLikeList,//猜你喜欢模块信息
              playerUrl: res.data.data.videoInfo.playerUrl,//视频url
              collectTag: res.data.data.videoInfo.collectTag//视频是否收藏
            });
            console.log('登录的收藏' + res.data.data.videoInfo.collectTag);
          }
        },
        fail: function (res) {
          if (res.data.status == 500) {
            console.log(res.data.msg)
          }
        }
      });
    }

    //判断视频是否点赞过
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/checkLike',
      data: {
        user_id: user_id,
        video_id: video_id
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log("是否视频点过赞：" + res.data.msg);
          that.setData({
            isLike: res.data.data
          })
        }
      },
    });

    //5、获取该视频下的所有评论和回复 接口
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getComments',
      data: {
        post_id: video_id,
        user_id: user_id
      },
      success: function (res) {
        if (res.data.status == 200) {
          console.log("评论信息：" + res.data.status);
          var json = JSON.stringify(res);
          // console.log('json'+json);

          that.setData({
            commentUser: res.data.data,
            focus: true,
          })
        }
      },
    });

    //9、获取该视频下的评论数 接口
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/getCommentsNum?post_id=' + video_id,
      success: function (res) {
        if (res.data.status == 200) {
          console.log('获取评论数' + res.data.msg);
          that.setData({
            commentNum: res.data.data
          })
        }
      },
      fail: function (res) {
        if (res.data.status == 500) {
          console.log(res.data.msg)
        }
      }
    });
  },




  //4、视频点赞
  addLikeClick: function (event) {
    var video_id = event.currentTarget.dataset.id;
    var that = this;
    var isLike = that.data.isLike;
    var isLogin = that.data.isLogin;
    var user_id = that.data.user_id;
    if (isLogin) {
      if (isLike) {
        wx.request({
          url: 'https://www.qifanlee.top:8412/api/v1/addLikeNum',
          data: {
            user_id: user_id,
            video_id: video_id
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.status == 200) {
              console.log("视频：" + res.data.msg);
              that.setData({
                likeNum: res.data.data
              });
            };
            //刷新页面
            that.onLoad(that.data.options);
          },
        });
      } else {
        wx.showToast({
          title: '已点赞',
          icon: 'none',
          duration: 1000//持续的时间
        })
      }
    } else {
      wx.showModal({
        title: '请登录',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后     
            console.log('用户点击确定');
            wx.reLaunch({
              url: '/pages/mine/mine',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {//这里是点击了取消以后     
            console.log('用户点击取消')
          }
        }

      })
    }
  },

  //获取评论者当前写的评论
  getCommentText: function (event) {
    var comment_text = event.detail.value;//想要发布的评论
    this.setData({
      comment_text: comment_text
    });
  },
  //获取被评论者的信息
  replyComment: function (event) {
    var that = this;
    var replyId = event.currentTarget.dataset.cid;//被回复的id
    var replyName = event.currentTarget.dataset.name;
    var replyPid = event.currentTarget.dataset.pid;//回复所属的评论id
    that.setData({
      replyId: replyId,
      replyName: replyName,
      replyPid: replyPid,
      focus: true,
      placeholder: '回复' + replyName + ":"
    });
  },
  //input失去焦点时
  onReplyBlur: function (e) {
    var that = this;
    const text = e.detail.value;
    if (text === '') {
      that.setData({
        replyId: '',
        replyName: '',
        replyPid: '',
        placeholder: "请写下您的评论",
        focus: false
      });
    }
  },

  //6、7、评论接口 回复接口 点击发送
  sendComment: function () {
    var that = this;
    var comment_text = that.data.comment_text;
    var userId = that.data.user_id;//发布评论者的id
    var video_id = that.data.video_id;//视频id
    var replyId = that.data.replyId;//获取被回复者id
    var replyPid = that.data.replyPid;//所属父级评论id
    var isLogin = that.data.isLogin;
    console.log('内容：' + comment_text);
    if (isLogin) {
      if (replyId == '' && replyPid == '') {
        wx.request({
          url: 'https://www.qifanlee.top:8412/api/v1/toComments',
          data: {
            content: comment_text,
            postId: video_id,
            userId: userId,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status == 200) {
              console.log('发布评论：' + res.data.msg)
            };
            //刷新页面
            that.onLoad(that.data.options);
          }
        });
        //清空input框
        var setMessage = { sendInfo: this.data.comment_text };
        this.setData(setMessage);
      } else {
        wx.request({
          url: 'https://www.qifanlee.top:8412/api/v1/toComments',
          data: {
            content: comment_text,
            postId: video_id,
            userId: userId,
            replyUserId: replyId,
            pid: replyPid
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            if (res.data.status == 200) {
              console.log(userId + "回复：" + res.data.msg)
            };
            //刷新页面
            that.onLoad(that.data.options);
          },
        });
        //清空data中的某些数据
        that.setData({
          replyId: '',
          replyName: '',
          replyPid: '',
          placeholder: "请写下您的评论",
          focus: false
        });
        //清空input框
        var setMessage = { sendInfo: this.data.comment_text };
        this.setData(setMessage);
      }

    } else {
      wx.showModal({
        title: '请登录',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后     
            console.log('用户点击确定');
            wx.reLaunch({
              url: '/pages/mine/mine',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {//这里是点击了取消以后     
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //8、删除评论和回复 接口
  commentDelete: function (event) {
    var that = this;
    var deleteId = event.currentTarget.dataset.cid;//删除评论id  
    wx.request({
      url: 'https://www.qifanlee.top:8412/api/v1/delComments',
      data: {
        comment_id: deleteId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status == 200) {
          console.log('评论删除：' + res.data.msg);
        };
        //刷新页面
        that.onLoad(that.data.options);
      },
      fail: function (res) {
        if (res.data.status == 500) {
          console.log(res.data.msg)
        }
      }
    });
  },

  //评论点赞评论
  commentLikeClick: function (event) {
    var that = this;
    var isLogin = that.data.isLogin;
    var user_id = that.data.user_id;
    var commentId = event.currentTarget.dataset.id;
    var clickLike = event.currentTarget.dataset.clicklike;
    if (isLogin) {
      if (clickLike) {
        wx.request({
          url: 'https://www.qifanlee.top:8412/api/v1/addComLikeNum',
          data: {
            comment_id: commentId,
            user_id: user_id
          },
          success: function (res) {
            if (res.data.status == 200) {
              console.log("评论点赞：" + res.data.msg);
            };
            //刷新页面
            that.onLoad(that.data.options);
          }
        });
      }
    } else {
      wx.showModal({
        title: '请登录',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后     
            console.log('用户点击确定');
            wx.reLaunch({
              url: '/pages/mine/mine',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {//这里是点击了取消以后     
            console.log('用户点击取消')
          }
        }

      })
    }
  },

  //点击收藏
  collectClick: function (event) {
    var that = this;
    var collectTag = that.data.collectTag;
    var videoId = event.currentTarget.dataset.videoid;
    var userId = event.currentTarget.dataset.userid;
    if (userId == '') {
      wx.showModal({
        title: '请登录',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后     
            console.log('用户点击确定');
            wx.reLaunch({
              url: '/pages/mine/mine',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {//这里是点击了取消以后     
            console.log('用户点击取消')
          }
        }
      })
    } else {
      if (collectTag) {
        wx.request({
          url: 'https://www.qifanlee.top:8412/api/v1/addCollect',
          data: {
            videoId: videoId,
            userId: userId,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.status == 200) {
              console.log("评论：" + res.data.msg);
            };
            //刷新页面
            that.onLoad(that.data.options);
          }
        })
      } else {
        wx.showToast({
          title: '已收藏',
          icon: 'none',
          duration: 1000//持续的时间
        })
      }
    }
  }

})