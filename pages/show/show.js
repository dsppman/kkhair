// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "正在加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    const db = wx.cloud.database()
    const _ = db.command
    const db_show = db.collection('show').doc(id)
    db_show.get({
      success:res => {
        this.setData(res.data)
      },
      complete:res => {
        db.collection('view_logs').add({
          data: {
            show_id: this.data._id,
            show_title: this.data.title,
            datetime: new Date()
          }
        })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      imageUrl: this.data.photos_url[0]
    }
  },

  ShowQRCode: function () {
    wx.previewImage({
      urls: [
        'cloud://test-406uy.7465-test-406uy-1302245476/test/微信图片_20200525145436.jpg'
      ],
    })
  }
})