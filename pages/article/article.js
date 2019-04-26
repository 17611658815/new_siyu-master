//引入js插件
const WxParse = require('../../wxParse/wxParse.js');
const Promise = require('../../common/promise.js')
const app = getApp()
Page({

  data: {
    articleId:"",//文章id
    articleList:[],//文章内容数组
    page:1,
    tostShow: false,
    isHide: 'none',
    off_on: false,
    title:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that  = this;
    that.setData({
      articleId: options.id,
    })
    that.getArticle()
  },
  onReachBottom: function () {
    let that = this;
    let url = app.globalData.ip + '?type=details_article';
    that.data.page++
    if (that.data.off_on == true) {
      return
    }
    that.loadingShow()
    Promise.get(url,{
      id: that.data.articleId,
      page: that.data.page
    },0).then(res=>{
      that.loadingHide()
      if (res.data.relevant.length > 0) {
        var list = that.data.articleList;
        for (var i = 0; i < res.data.relevant.length; i++) {
          list.relevant.push(res.data.relevant[i])
        }
        that.setData({
          articleList: list,  //赋值渲染
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
  //获取问答信息
  getArticle() {
    let that = this;
    let url = app.globalData.ip + '?type=details_article&id=' + that.data.articleId;
    Promise.get(url,{},1).then(res=>{
      WxParse.wxParse('article', 'html', res.data.article.content, that, 5);
      that.setData({
        articleList: res.data, //赋值渲染
        title: res.data.article.title
      });
    })
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
    })
  },
  //问答详情
  goToArticle(e) {
    let that = this;
    let articleId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'article?id=' + articleId,
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
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.title,
      path: '/pages/article/article?id=' + that.data.articleId + '&share_query=article',
    }
  }
})