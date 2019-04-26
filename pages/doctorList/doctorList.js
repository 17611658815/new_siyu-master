const Promise = require('../../common/promise.js')
const app = getApp()
Page({
  data: {
    tabs: [],
    list: ["视频", "问答", "音频", "文章"],
    doctorList: [],
    currentTab: 0,
    windowHeight: "",
    windowWidth: "",
    showflag: false,
    uid: "",
    page: 1,
    values: "",
    tostShow: false,
    isHide: 'none',
    off_on: false,
  },
  onLoad: function(options) {
    var that = this
    that.departmentList() //导航条
    that.getDoctorInfo() //推荐医生
  },
  //初始化默认渲染
  getDoctorInfo() {
    let that = this
    let url = app.globalData.ip + '?type=department_doctor';
    Promise.post(url, {}, 1)
      .then((res) => {
        that.setData({
          doctorList: res.data.list,
          showflag: true
        })
      }).catch((res) => {
        console.log(res)
      })
  },
  //推荐下拉加载
  getPullDoctorInfo() {
    let that = this
    let url = app.globalData.ip + '?type=department_doctor' + "&page=" + that.data.page;
    if (that.data.off_on == true) {
      return
    }
    that.loadingShow()
    Promise.get(url, {}, 0)
      .then((res) => {
        that.loadingHide()
        var doctorList = that.data.doctorList;
        if (res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            doctorList.push(res.data.list[i])
          }
          that.setData({
            doctorList: doctorList,
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
  //推荐点击事件
  recommend(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      tostShow: false,
      page: 1,
      doctorList: [],
      off_on: false
    });
    that.getDoctorInfo()
  },
  onReachBottom: function() {
    let that = this
    that.data.page++
      if (that.data.currentTab == 0) {
        that.getPullDoctorInfo()
      } else {
        that.docutotPull()
      }
  },
  //科室下拉加载
  docutotPull() {
    let that = this
    let url = app.globalData.ip + '?type=department_doctor&id=' + that.data.uid + "&page=" + that.data.page;
    if (that.data.off_on == true) {
      return
    }
    that.loadingShow()
    Promise.get(url, {}, 0)
      .then((res) => {
        that.loadingHide()
        var doctorList = that.data.doctorList;
        if (res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            doctorList.push(res.data.list[i])
          }
          that.setData({
            doctorList: doctorList,
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
  //tab样式切换
  swichNav: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var url = app.globalData.ip + '?type=department_doctor&id=' + id
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      uid: e.currentTarget.dataset.id,
      tostShow: false,
      off_on: false,
      page: 1,
      doctorList: []
    });
    Promise.get(url,{},1).then((res)=>{
      that.setData({
          doctorList: res.data.list,
        })
    })
  },
  //导航条
  departmentList() {
    let that = this;
    let url = app.globalData.ip + '?type=department_nav';
    Promise.get(url, {}, 1).then((res) => {
      that.setData({
        tabs: res.data.department
      })
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
  goSearch() {
    let that = this
    var values = that.data.values;
    console.log(that.data.values)
    wx.navigateTo({
      url: '/pages/search/search?values=' + values, //跳转医生主页
    })
  },
  godoctorHomePage(e) {
    var doctorId = e.currentTarget.dataset.id
    console.log(doctorId)
    wx.navigateTo({
      url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId, //跳转医生主页
    })
  },
  //搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  //医生详情视频页
  godoctorHomevideo(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + '&one=0',
      })
    } else {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + '&one=1',
      })
    }

  },
  // //医生详情回答页
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
      })
    } else {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=2",
      })
    }

  },
  //医生详情文章页
  godoctorHomearticle(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num

    if (num == 0) {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
      })
    } else {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=3",
      })
    }

  },
  //医生详情音频页
  godoctorHomeaudio(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
      })
    } else {
      wx.navigateTo({
        url: '/pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=4",
      })
    }
  },
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '民福康-专家列表',
      path: '/pages/doctorList/doctorList',
    }
  },
})