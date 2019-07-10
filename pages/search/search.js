// pages/searchPage/searchPage.js
const WxParse = require('../../wxParse/wxParse.js');
const Promise = require('../../common/promise.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: ['综合', '疾病', '专家', '视频','问答', '文章', '音频'],
    currentTab: 0,
    illnessList:[],
    pageChange: true,
    searchMsg: "",
    searchHomeList: [], //搜索主页列表
    searchHomeLists: [],
    hotList: [],
    page:1,
    tostShow: false,
    isHide: 'none',
    off_on: false,
    searchRecord: wx.getStorageSync('searchRecord') ? wx.getStorageSync('searchRecord') : [],
    contype: ['home','illness', 'doctor', 'shipin', 'ask', 'article','yinpin'],
    lengthNum:'1'
  },
  onLoad(options) {
    let that = this
    console.log(options)
    that.hotIllness()
    that.openHistorySearch()
  },
  openHistorySearch: function () {
    var that = this
    that.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  onShow() {
    this.hotIllness()
    this.openHistorySearch()
  },
  //搜索内容
  searchMsgs(e) {
    let that = this;
    let url = app.globalData.ip + '?type=hot_key&q=' + that.data.searchMsg
    that.setData({
      searchMsg: e.detail.value 
    })
    if (e.detail.value.length>0){
      Promise.get(url,{},0).then(res=>{
        that.setData({
          illnessList: res.data.ad
        })
      })
    }
    if (e.detail.value.length == 0){
      that.setData({
        illnessList: []
      })
    }
  },
  //热搜词
  hotIllness() {
    let that = this;
    let url = app.globalData.ip + '?type=hot_key';
    Promise.get(url,{},0).then(res=>{
      that.setData({
        hotList: res.data.ad
      })
    })
  },
  searchHot(e) {
    let that = this;
    that.setData({
       searchMsg:e.currentTarget.dataset.value
    },()=>{
      let url = app.globalData.ip + '?type=search_home&q=' + that.data.searchMsg;
      that.addStoage()
      Promise.get(url, {}, 1).then(res => {
        that.setData({
          searchHomeLists: res.data,
          pageChange: false
        })
      })
    })
  },
  searchHot2(e) {
    let that = this
    that.setData({
      searchMsg: e.currentTarget.dataset.value
    },()=>{
      let url = app.globalData.ip + '?type=search_home&q=' + that.data.searchMsg;
      Promise.get(url,{},1).then(res=>{
        that.setData({
          searchHomeLists: res.data,
          pageChange: false
        })
      })
    })
  },
  //下拉加载
  onReachBottom: function() {
    let that = this
    that.data.page++
      if (that.data.currentTab > 0 && !that.data.off_on) {  //疾病列表
      that.loadingShow()
      that.loadmore()
    } 
  },
  //综合数据
  searchIllness(url) {
    let that = this
    that.addStoage()
    console.log(that.data.searchMsg == '')
    if (that.data.searchMsg == ''){
      that.alert('搜索内容不能为空！')
      return
    }
    Promise.get(app.globalData.ip + '?type=search_home&q=' + that.data.searchMsg,{},1).then(res=>{
      that.setData({
        searchHomeLists: res.data,
        pageChange: false
      })
    })
  },
  //历史记录
  addStoage(){
    var that = this
    var searchRecord = wx.getStorageSync('searchRecord') || []
    if (that.data.searchMsg == '') {
      return
    }
    else {
      //将搜索值放入历史记录中,只能放前五条
      console.log(that.data.searchMsg, searchRecord, searchRecord.indexOf(that.data.searchMsg))
      console.log(searchRecord.length)
      if (searchRecord.length < 10 && searchRecord.indexOf(that.data.searchMsg) == -1) {
        searchRecord.unshift(
          that.data.searchMsg,
        )
      }
      else if (searchRecord.length == 10){
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
           that.data.searchMsg,
        )
      }
      wx.setStorageSync('searchRecord', searchRecord)
    }
  },
  //删除历史记录
  historyDelFn: function () {
    wx.removeStorage({
      key: 'searchRecord'
    })
    this.setData({
      searchRecord:[]
    })
  },
  //疾病列表
  loadmore(){
    let that = this
    let url = app.globalData.ip + '?type=search_' + that.data.contype[that.data.currentTab] + '&q=' + that.data.searchMsg + "&page=" + that.data.page;
    if (that.data.off_on == true) {
      return
    }
    Promise.get(url,{},0).then(res=>{
      that.loadingHide()
      var searchHomeList = that.data.searchHomeList;
      if (res.data[that.data.contype[that.data.currentTab]].length > 0) {
        for (var i = 0; i < res.data[that.data.contype[that.data.currentTab]].length; i++) {
          searchHomeList.push(res.data[that.data.contype[that.data.currentTab]][i])
        }
        that.setData({
          searchHomeList: searchHomeList,
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
  //tab切换请求数据
  tabMsg(url) {
    let that = this;
    Promise.get(url,{},1).then(res=>{
      that.setData({
        searchHomeList: res.data[that.data.contype[that.data.currentTab]],
        lengthNum: res.data[that.data.contype[that.data.currentTab]].length,
        pageChange: false,
        page: 1
      })
    })
  },
  //tab切换
  swichNav: function(e) {
    let that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      off_on: false,
      tostShow: false,
      page: 1,
      searchHomeList:[]
    });
    if (that.data.currentTab == 0) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_' + that.data.contype[e.currentTarget.dataset.current]+'&q=' + that.data.searchMsg
      that.searchIllness(url)
    } else  {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_' + that.data.contype[e.currentTarget.dataset.current] +'&q=' + that.data.searchMsg
      that.tabMsg(url)
    } 
  },
  //更多疾病
  moreIllness() {
    let that = this;
    that.setData({
      currentTab: 1
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_illness&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多医生
  moreDoctor() {
    let that = this;
    that.setData({
      currentTab: 2
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_doctor&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多视频
  moreVideo() {
    let that = this;
    that.setData({
      currentTab: 3
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_shipin&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多问答
  moreAsk() {
    let that = this;
    that.setData({
      currentTab: 4
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_ask&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多文章
  moreArticle() {
    let that = this;
    that.setData({
      currentTab: 5
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_article&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多音频
  moreAudio() {
    let that = this;
    that.setData({
      currentTab: 6
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_yinpin&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //疾病详情
  goToillness(e) {
    var that = this;
  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    that.setData({
      searchMsg: name
    })
    that.addStoage()
    wx.navigateTo({
      url: "/pages/disease/disease?diseaseId=" + id + '&name=' + name,
    });
  },
  //疾病详情
  goToillness2(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "/pages/disease/disease?diseaseId=" + id + '&name=' + name,
    });
  },
  //医生主页
  goTodoctor(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/doctorHomePage/doctorHomePage?doctorId=" + id,
    });
  },
  //视频主页
  goToVideo(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/video/video?videoId=" + id,
    });
  },
  //问答页面
  goToAsk(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/answer/answer?id=" + id,
    });
  },
  //文章详情
  goToArticle(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/article/article?id=" + id,
    });
  },
  //音频详情
  goToAudio(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "/pages/audio/audio?id=" + id,
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
})