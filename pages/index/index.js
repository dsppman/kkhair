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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh()
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
    setTimeout(() => {
      this.data._loaded = false
      this.data._page = 1
      this.setData({
        list: this._GetListData(),
      })
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data._loaded) {
      this.setData({
        loading: true,
      })
      setTimeout(() => {
        this.data._page++
        const data = this._GetListData()
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
      }, 1000)
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
        path: '/pages/show/show?id=' + this.data.list[index].id,
        imageUrl: this.data.list[index].thumb // 图片 URL
      }
    } else {
      return {
        title: 'kk家发色小铺',
        imageUrl: 'http://p5.so.qhimgs1.com/t0269418fde681cc850.jpg' // 图片 URL
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
  _GetListData() {
    if (this.data._page > 5) {
      return []
    } else {
      return [{
        id: 12580,
        title: "免漂五彩斑斓黑发色",
        desc: "红蓝棕",
        thumb: "https://wx1.sbimg.cn/2020/05/25/100913647_242491737039992_6051746423206843691_n.jpg"
      },
      {
        id: 12581,
        title: "免漂五彩斑斓黄发色",
        thumb: "http://p0.so.qhimgs1.com/t02d92ca722a82caac8.jpg"
      },{
        id: 12582,
        title: "免漂五彩斑斓紫发色",
        thumb: "http://p5.so.qhimgs1.com/t0269418fde681cc850.jpg"
      },]
    }
  }
})