// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    navBarList: [
      {
        title: "最新"
      },
      {
        title: "推荐"
      },
      {
        title: "高赞"
      },
      {
        title: "红棕"
      },
      {
        title: "蓝白"
      },
      {
        title: "黑红"
      },
      {
        title: "五彩"
      },
      {
        title: "七彩"
      }
    ],
    list: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    this.data._db_show = db.collection('show')
    db.collection('base').doc('989f4e215ecc002d003c17c931055e0d').get().then(res => {
      this.data._share_photo_url = res.data.share_photo_url
      this.data._share_title = res.data.share_title
    })
    wx.startPullDownRefresh()
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
    this.data._loaded = false
    this.data._page = 1
    this._GetListData(res => {
      this.setData({
        list: res.data,
      }, function () {
        wx.stopPullDownRefresh()
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data._loaded) {
      this.setData({
        loading: true,
      },function () {
        this.data._page++
        this._GetListData(res => {
          const data = res.data
          if (data.length > 0) {
            this.setData({
              list: this.data.list.concat(data),
              loading: false,
            })
          } else {
            this.setData({
              loading: false,
            },function() {
              this.data._loaded = true
            })
          }
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      const index = res.target.dataset.index
      return {
        title: this.data.list[index].title,
        path: '/pages/show/show?id=' + this.data.list[index]._id,
        imageUrl: this.data.list[index].photos_url[0] // 图片 URL
      }
    } else {
      return {
        title: this.data._share_title,
        imageUrl: this.data._share_photo_url // 图片 URL
      }
    }
  },
  switchTab: function (res) {
    const index = res.currentTarget.dataset.index
    if (index != this.data.active) {
      this.setData({
        active: index
      },function () {
        wx.startPullDownRefresh()
      })
    }
  },
  toShowPage: function (res) {
    const id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/show/show?id=' + id,
    })
  },
  _GetListData(obj) {
    const max_limit = 6
    const page = this.data._page - 1
    this.data._db_show.orderBy('datetime', 'desc').
    skip(page * max_limit).limit(max_limit).
    field({
      _id: true,
      tags: true,
      title: true,
      content: true,
      photos_url: true
    }).get().then(obj)
  }
})