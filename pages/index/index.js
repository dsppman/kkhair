// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    category: [
      "最新"
    ],
    list: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data._db = wx.cloud.database()
    const db_base = this.data._db.collection('base').doc('base')
    db_base.update({
      data: {
        admin_time: new Date()
      },
      success: res => {
        this.setData({
          admin: true
        })
      }
    })
    db_base.get({
      success: res => {
        this.data._share_photo_url = res.data.share_photo_url
        this.data._share_title = res.data.share_title
        this.setData({
          category: this.data.category.concat(res.data.category)
        })
      }
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
      this.data._db.collection('share_logs').add({
        data: {
          page: 'index',
          show_id: this.data.list[index]._id,
          show_title: this.data.list[index].title,
          datetime: new Date()
        }
      })
      return {
        title: this.data.list[index].title,
        path: '/pages/show/show?id=' + this.data.list[index]._id,
        imageUrl: this.data.list[index].photos_url[0] // 图片 URL
      }
    } else {
      this.data._db.collection('share_logs').add({
        data: {
          page: 'index',
          datetime: new Date()
        }
      })
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

  backTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  toAddShow: function () {
    if (this.data.admin) {
      wx.navigateTo({
        url: '/pages/admin/admin',
      })
    }
  },

  toSetting: function () {
    if (this.data.admin) {
      wx.navigateTo({
        url: '/pages/admin/setting',
      })
    }
  },

  delShow: function (res) {
    const index = res.currentTarget.dataset.index
    if (this.data.admin) {
      wx.showModal({
        title: '删除推文',
        content: '是否删除' + this.data.list[index].title.substr(0,20),
        confirmText: '删除',
        success:res => {
          if (res.confirm) {
            this.data._db.collection('show').doc(this.data.list[index]._id).remove({
              success: res => {
                wx.cloud.deleteFile({
                  fileList: this.data.list[index].photos_url
                })
                this.data.list.splice(index, 1)
                this.setData({
                  list:this.data.list
                }, function(){
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                  })
                })
              }
            })
          }
        }
      })
    }
  },

  /**
   * 私有方法
   */
  _GetListData(obj) {
    const max_limit = 6
    const page = this.data._page - 1

    const db_show = this.data._db.collection('show').orderBy('datetime', 'desc')
    if (this.data.active > 0) {
      db_show.skip(page * max_limit).limit(max_limit).
      where({
        tags: this.data.category[this.data.active]
      }).field({
        _id: true,
        tags: true,
        title: true,
        content: true,
        photos_url: true
      }).get({
        success: obj
      })
    } else {
      db_show.skip(page * max_limit).limit(max_limit).
      field({
        _id: true,
        tags: true,
        title: true,
        content: true,
        photos_url: true
      }).get({
        success: obj
      })
    }
  }
})