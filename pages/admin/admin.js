// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    temp_url: [],
    title_count: 0,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.onChooseImg()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  changeTitleLen:function (e) {
    this.data.title = e.detail.value
    this.setData({
      title_count: e.detail.value.length
    })
  },

  changeContent:function (e) {
    this.data.content = e.detail.value
  },

  onChooseImg: function () {
    const count = this.data.temp_url.length
    wx.chooseImage({
      count: 9 - count,
      sourceType: ['album'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          temp_url: this.data.temp_url.concat(res.tempFilePaths)
        })
      }
    })
  },

  onSubmit: function () {
    const close = () => {
      this.setData({
        loading: false
      },function() {
        wx.hideLoading()
      })
    }

    this.setData({
      loading: true
    },function() {
      if (this.data.title.length == 0 || this.data.title.length > 15) {
        wx.showToast({
          title: '请正确填写标题',
          icon: 'none',
          duration: 2000,
          complete: close
        })
      } else if (this.data.content.length > 300) {
        wx.showToast({
          title: '请正确填写内容，不可超300字',
          icon: 'none',
          duration: 2000,
          complete: close
        })
      } else if (this.data.temp_url.length == 0) {
        wx.showToast({
          title: '请上传照片，最多可上传九张图',
          icon: 'none',
          duration: 2000,
          complete: close
        })
      } else {
        const photos_url = []
        const date = new Date()
        const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        const uploader = index => {
          const element = this.data.temp_url[index];
          const filename = element.substr(element.lastIndexOf('/')+1)
          wx.showLoading({
            title: '上传第 ' + (index + 1) + ' 张图片...',
          })
          wx.cloud.uploadFile({
            cloudPath: 'show/' + time + '/' + filename,
            filePath: element,
            success: res => {
              photos_url.push(res.fileID)
              index = index + 1
              if (index == this.data.temp_url.length) {
                console.log(photos_url)
                wx.cloud.database().collection('show').add({
                  data: {
                    title: this.data.title,
                    photos_url: photos_url,
                    content: this.data.content,
                    datetime: new Date()
                  },
                  success: res => {
                    this.setData({
                      title: '',
                      content: '',
                      temp_url: []
                    }, close)
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                })
              } else {
                uploader(index)
              }
            }
          })
        }

        uploader(0)
      }
    })
  }
})