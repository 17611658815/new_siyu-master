// pages/video/video.js
const WxParse = require('../../wxParse/wxParse.js');
const Promise = require('../../common/promise.js')
const app = getApp()
Page({
  data: {
      videoId:"",//视频id
      videoMsg:{},//视频信息
      page: 1,
      url: '',
      isHide: 'none',
      off_on: false,
      autoHeight:'',
      posterShow:false,
      boXShow:true,
      isplay:false,
      goIndex:false,
      title:'',
      tostShow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      videoId: options.videoId,
    });
    console.log(options.bol)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          autoHeight: ((res.windowWidth) / 16) * 9
        });
      }
    });
    //直接调用
    that.getVideo()
  },
  //点击播放视频
  bindplay(){
    var taht = this
    this.setData({
      boXShow:false
    })
  },
  //播放结束
  bindended(){
   var taht = this
    this.setData({
      boXShow:true,
      goIndex: true
    })
  },
  //点击再次播放
  repPlay() {
    var that = this
    var prevV = wx.createVideoContext('video');
    prevV.play()
    that.setData({
      boXShow: false,
      isplay: true
    })
  },
  //获取视频信息
  getVideo(){
    let that = this;
    let url = app.globalData.ip + '?type=details_shipin'
    Promise.get(url, {id: that.data.videoId},1).then(res=>{
      WxParse.wxParse('article', 'html', res.data.shipin.content, that, 5);
      that.setData({
        videoMsg: res.data,
        title: res.data.shipin.title
      });
    })
  },
  //下拉加载更多
  onReachBottom: function () {
    let that = this
    let url = app.globalData.ip + '?type=details_shipin&id=' + that.data.videoId + '&page=' + that.data.page;
    if (that.data.off_on == true) {
      return
    }
    that.data.page++
    that.loadingShow()
    Promise.get(url,{},0).then(res=>{
      if (res.data.relevant.length > 0) {
        var videoLis = that.data.videoMsg;
        for (var i = 0; i < res.data.relevant.length; i++) {
          videoLis.relevant.push(res.data.relevant[i])
        }
        that.setData({
          videoMsg: videoLis,
          off_on: false
        });
      } else {
        that.setData({
          isHide: 'none',
          tostShow: true,
          off_on: true
        });
      }
    })
  },
  //播放推荐视频
  goToDetails(e) {
    let that = this;
    let videoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'video?videoId=' + videoId,
    })
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
    })
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
  //返回首页
  goidnex(){
    var that = this
    wx.switchTab({
      url: '../index/index',
    }) 
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return{
      title: that.data.title,
      path: '/pages/video/video?videoId=' + that.data.videoId + '&share_query=video',
    }
  },
})