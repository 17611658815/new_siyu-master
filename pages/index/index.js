//index.js
//获取应用实例
const Promise = require('../../common/promise.js')
const app = getApp()
Page({
  data: {
    tabs: [],
    illnessList: [],
    currentTab: 0, //tab切换默认值
    illnesstab: null, //可是tab样式
    windowHeight: "",
    windowWidth: "",
    keshiId: "", //科室id
    illnessId: "", //疾病id
    homeList: [], //主页页面
    page: 1,
    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    tostShow: false,
    isHide: 'none',
    off_on: false,
    id: '2'
  },
  //事件处理函
  onLoad: function (option) {
    let that = this;
    var user = wx.getStorageSync('globalData') || null;
    that.hotillness()
    that.loadList()
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onLoad()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //热门疾病
  hotillness() {
    let that = this
    let url = app.globalData.ip + '?type=hot_illness'
    Promise.get(url, {}, 1)
      .then((res) => {
        that.setData({
          illnessList: res.data.illness
        })
      }).catch((res) => {
        console.log(res)
      })
  },
  //获取科室数据
  loadList() {
    let that = this
    let url ='https://api.mfk.com/app/api/mfk_shipin_app2.php?type=home_list' + "&page=" + that.data.page
    if (that.data.off_on == true) {
      return
    }
    Promise.get(url, {}, 0)
      .then((res) => {
        if (res.data.list.length > 0) {
          var list = that.data.homeList
          for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i])
          }
          that.setData({
            homeList: list,
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
  //上滑加载
  onReachBottom: function () {
    var that = this;
    that.data.page++
    that.loadingShow()
    that.loadList()
  },

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

  //更多疾病列表页面
  goTodiseaseList() {
    wx.navigateTo({
      url: '/pages/diseaseList/diseaseList',
    });
  },
  //视频
  goToDetails(e) {
    let id = e.currentTarget.dataset.id
    let types = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/video/video?videoId=' + id + '&bol=true',
    });
  },
  //科普视频
  goVideohoem() {
    wx.navigateTo({
      url: '/pages/videohome/videohome',
    });
  },
  //名医问答
  goAskhoem() {
    wx.navigateTo({
      url: '/pages/askhome/askhome',
    });
  },
  //专家文章
  goArticlehome() {
    wx.navigateTo({
      url: '/pages/articlehome/articlehome',
    });
  },
  //专家音频
  goAudiohome() {
    wx.navigateTo({
      url: '/pages/audiohome/audiohome',
    });
  },

  //疾病详情
  goToDisease(e) {
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.illnessid
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/disease/disease?diseaseId=' + id + "&name=" + name,
    });
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },

  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-大健康科普知识平台',
      path: '/pages/index/index',
    }
  },

})