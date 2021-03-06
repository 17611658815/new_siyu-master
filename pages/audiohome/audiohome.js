const Promise = require('../../common/promise.js')
const app = getApp()
Page({
  data: {
    homeList: [],
    illnessList: [],
    tostShow: false,
    isHide: 'none',
    off_on: false,
    page: 1,
  },
  onLoad: function (options) {
    var that = this
    that.loadList()
  },
  loadList() {
    let that = this;
    let url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=home_yinpin' + "&page=" + that.data.page;
    if (that.data.off_on == true) {
      return
    }
    that.loadingShow()
    Promise.get(url, {}, 0)
      .then((res) => {
        var illnessList = res.data.illness
        if (res.data.list.length > 0) {
          var list = that.data.homeList
          for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i])
          }
          that.setData({
            homeList: list,
            illnessList: illnessList
          })
        } else {
          that.setData({
            isHide: 'none',
            tostShow: true,
            off_on: true
          })
        }
      })
  },
  //更多疾病列表页面
  goTodiseaseList() {
    wx.navigateTo({
      url: '/pages/diseaseList/diseaseList',
    });
  },
  //音频详情
  goAudio(e) {
    let that = this;
    console.log(e.currentTarget.dataset.id)
    let audioId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/audio/audio?id=' + audioId,
    })
  },
  onReachBottom: function () {
    var that = this
    that.loadingShow()
    that.data.page++
    that.loadList()
  },
  //loadingShow
  loadingShow() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'block',
    })
  },
  loadingHide() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'none',
    })
  },
  // 疾病详情
  goToDisease(e) {
    let that = this;
    let id = e.currentTarget.dataset.illnessid
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/disease/disease?diseaseId=' + id + "&name=" + name + "&types=4",
    });
  },
  onShareAppMessage: function () {
    return app.share(
      '/pages/audiohome/audiohome?share_query=audiohome',
    );
  }
})