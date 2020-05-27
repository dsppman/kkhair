// pages/admin/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode_url: '',
    share_photo_url: '',
    share_title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.data._db_base = wx.cloud.database().collection('base').doc('base')
    this.data._db_base.get({
      success: res => {
        this.setData(res.data, wx.hideLoading)
        this.data._orginal = res.data
        console.log(this.data._orginal)
      },
      fail: wx.hideLoading
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 更换二维码
   */
  changeQrcode: function () {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          qrcode_url: res.tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 更换名片图
   */
  changeShareImg: function () {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          share_photo_url: res.tempFilePaths[0]
        })
      }
    })
  },

  /**
   * 更换名片标题
   */
  changeTitle: function (e) {
    this.setData({
      share_title: e.detail.value
    })
  },

  /**
   * 提交
   */
  onSubmit: function () {
    this.setData({
      loading: true
    }, function () {
      wx.showLoading({
        title: '正在设置...',
      })
      const date = new Date()
      const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

      const update_data = () => {
        this.data._db_base.update({
          data: {
            qrcode_url: this.data.qrcode_url,
            share_photo_url: this.data.share_photo_url,
            share_title: this.data.share_title
          },
          success: res => {
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 2000,
            })
            this.data._orginal.share_photo_url = this.data.share_photo_url
            this.data._orginal.qrcode_url = this.data.qrcode_url
            this.data._orginal.share_title = this.data.share_title
          },
          fail: res => {
            wx.showToast({
              title: '设置失败',
              icon: 'none',
              duration: 2000
            })
          },
          complete: res => {
            this.setData({
              loading: false
            })
          }
        })
      }

      const check_share = () => {
        if (this.data.share_photo_url != this.data._orginal.share_photo_url) {
          console.log('dd')
          wx.cloud.deleteFile({
            fileList: [this.data._orginal.share_photo_url]
          })
          wx.showLoading({
            title: '正在上传分享图...',
          })
          const filename = this.data.share_photo_url.substr(this.data.share_photo_url.lastIndexOf('/')+1)
          wx.cloud.uploadFile({
            cloudPath: 'base/share/' + filename,
            filePath: this.data.share_photo_url,
            success: res => {
              this.setData({
                share_photo_url: res.fileID
              })
              update_data()
            }
          })
        } else {
          update_data()
        }
      }

      if (this.data.qrcode_url != this.data._orginal.qrcode_url) {
        wx.cloud.deleteFile({
          fileList: [this.data._orginal.qrcode_url]
        })
        wx.showLoading({
          title: '正在上传二维码图...',
        })
        const filename = this.data.qrcode_url.substr(this.data.qrcode_url.lastIndexOf('/')+1)
        wx.cloud.uploadFile({
          cloudPath: 'base/qrcode/' + filename,
          filePath: this.data.qrcode_url,
          success: res => {
            this.setData({
              qrcode_url: res.fileID
            })
            check_share()
          }
        })
      } else {
        check_share()
      }
    })
  }
})