// pages/answer/answer.js
const Promise = require('../../common/promise.js')
const app = getApp()
Page({

  data: {
    askId:"",//问答id
    askList:{},//问答详情列表
    page:1,
    tostShow: false,
    isHide: 'none',
    off_on: false,
    goHome:false,
    title:''
  },
  
  onLoad: function (options) {
    let that = this;
    that.setData({
      askId: options.id,    //问答id 赋值
    },()=>{
        that.getAsk();//页面加载直接调用
    })
  },
  //获取问答信息
  getAsk() {
    let that = this;
    let url = app.globalData.ip + '?type=details_ask&id=' + that.data.askId
    Promise.get(url,{},1).then(res=>{
      that.setData({
        askList: res.data,  //赋值渲染
        title: res.data.ask.title
      });
    })
  },
  //下拉加载
  onReachBottom: function () {
    let that = this
    let url = app.globalData.ip + '?type=details_ask&id='+that.data.askId+'&page='+that.data.page
    that.data.page++
    if (that.data.off_on == true) {
      return
    }
    that.loadingShow()
    Promise.get(url,{},0).then(res=>{
      that.loadingHide()
      if (res.data.relevant.length > 0) {
        var list = that.data.askList;
        for (var i = 0; i < res.data.relevant.length; i++) {
          list.relevant.push(res.data.relevant[i])
        }
        that.setData({
          askList: list,  //赋值渲染
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
  //相关问答跳转
  goAsk(e){
    let that = this;
    let askId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'answer?id=' + askId,
    })
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
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
  goidnex() {
    var that = this
    wx.switchTab({
      url: '../index/index',
    })

  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.title,
      path: '/pages/answer/answer?id=' + that.data.askId,
    }
  },
})