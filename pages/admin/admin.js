// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    temp_url: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onChooseImg()
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

  changeTitle:function (e) {
    this.setData({
      title: e.detail.value
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

  delImg: function (res) {
    const index = res.currentTarget.dataset.index
    wx.showModal({
      title: '删除图片',
      content: '是否删除第' + (index + 1) + '张图片',
      confirmText: '删除',
      success:res => {
        if (res.confirm) {
          this.data.temp_url.splice(index, 1)
          this.setData({
            temp_url:this.data.temp_url
          })
        }
      }
    })
  },

  onSubmit: function () {
    const loaded = () => {
      this.setData({
        loading: false
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
          complete: loaded
        })
      } else if (this.data.content.length > 300) {
        wx.showToast({
          title: '请正确填写内容，不可超300字',
          icon: 'none',
          duration: 2000,
          complete: loaded
        })
      } else if (this.data.temp_url.length == 0) {
        wx.showToast({
          title: '请上传照片，最多可上传九张图',
          icon: 'none',
          duration: 2000,
          complete: loaded
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
                    }, loaded)
                    wx.showToast({
                      title: '发布成功',
                      icon: 'success'
                    })
                  },
                  fail: res => {
                    wx.showToast({
                      title: '发布失败',
                      icon: 'none',
                      complete: loaded
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