const Promise = require('../../common/promise.js')
const app = getApp()
Page({

  data: {
     userid:'',
     doctorList:[],
     page:1,
  },
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onLoad()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }, 
  onShow() { 
    this.getDoctorList()
  },
  onLoad: function (options) {
    var that = this
    var user = wx.getStorageSync('globalData') || null
    var userid = (user.user.id != undefined) ? user.user.id : 0;
    if (userid == 0) {
      app.getUserInfo(that.onLoad);
      return
    }
    console.log(userid)
    that.setData({
      userid: userid,
    })  
    that.getDoctorList()
  },
  onReachBottom: function () {
    var that = this;
    var url = app.globalData.ip + '?type=get_collection&id=' + that.data.userid + "&page=" + that.data.page;
    that.data.page++
    Promise.get(url,{},1).then(res=>{
      var list = that.data.doctorList
      for (var i = 0; i < res.data.data.length; i++) {
        list.push(res.data.data[i])
      }
      that.setData({
        doctorList: list
      })
    })
  },
  //获取关注医生
  getDoctorList(){
    var that = this
    let url = app.globalData.ip + '?type=get_collection&id=' + that.data.userid;
    Promise.get(url,{},1).then(res=>{
      that.setData({
        doctorList: res.data.data
      }) 
    })

  },
  //搜索页面
  goToDoctorInfo(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/doctorHomePage/doctorHomePage?doctorId='+id,
    });
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-关注专家',
      path: '/pages/attentionDoctor/attentionDoctor?userid=' + that.data.userid
    }
  },
})