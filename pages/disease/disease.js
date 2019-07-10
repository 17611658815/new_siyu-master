const Promise = require('../../common/promise.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: ['概述', '视频', '问答', '文章', '音频'], //概述也tab切换数组
        currentTab: 0, //tab切换索引
        overviewList: [], //tab切换列表数组
        attrList: [], //就医指南
        illnessTitle: "", //病情描述
        illnessTitles: "", //展开后病情描述
        illnessName: "", //疾病名称
        illnessId: "", //疾病id
        guideShow: true, //就医指南展开折叠
        show: true, //病情描述展开折叠
        page: 1, //页码]
        tostShow: false,
        isHide: 'none',
        off_on: false,
        contype: ['home', 'shipin', 'ask', 'article', 'yinpin'],
        Gdata: {
            list: [],
            ask: [],
            article: [],
            yinpin: []
        },
        lengthNum: 1,
    },
    onLoad: function(options) {
        let that = this;
        //接收传递参数
        var currentTab = that.data.currentTab
        console.log(options)
        that.setData({
            currentTab: options.types ? options.types : 0,
            illnessId: options.diseaseId,
            illnessName: options.name,
        })
        if (that.data.currentTab == 0) {
            var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId //概述
            that.loadList(url);
        } else {
            var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId //概述
            that.tabList(url);
        }
        wx.setNavigationBarTitle({
            title: that.data.illnessName
        })
    },
    //概述列表 
    loadList(url) {
        let that = this
        Promise.post(url, {}, 1)
            .then((res) => {
                var list = that.data.list
                that.setData({
                    overviewList: res.data, //概述列表
                    illnessTitle: res.data.illness.introduction.slice(0, 45), //疾病问题截取
                    illnessTitles: res.data.illness.introduction, //完整问题
                    attrList: res.data.illness.attr.slice(0, 5), //展开收起截取
                    list: list
                })
            }).catch((res) => {
                console.log(res)
            })
    },
    //上滑加载
    onReachBottom: function() {
        console.log('触底了')
        let that = this
        that.data.page++
            that.loadingShow()
        if (that.data.currentTab > 0) {
            that.loadmoer()
        }
    },
    //加载内容列表
    loadmoer() {
        let that = this
        let Gdata = that.data.Gdata;
        let contype = that.data.contype;
        let url = app.globalData.ip + "?type=illness_" + contype[that.data.currentTab] + "&id=" + that.data.illnessId + "&page=" + that.data.page;
        if (that.data.off_on == true) {
            return
        }
        Promise.post(url, {}, 0)
            .then((res) => {
                console.log(res.data[contype[that.data.currentTab]])
                that.loadingHide()
                var overviewList = that.data.overviewList
                if (res.data[contype[that.data.currentTab]].length > 0) {
                    for (var i = 0; i < res.data[contype[that.data.currentTab]].length; i++) {
                        overviewList.push(res.data[contype[that.data.currentTab]][i])
                    }
                    that.setData({
                        overviewList: overviewList,
                        tostShow: false,
                        off_on: false
                    })
                    console.log(that.data.overviewList)
                } else {
                    console.log('空')
                    that.setData({
                        isHide: 'none',
                        tostShow: true,
                        off_on: true
                    })
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
    //tab切换
    swichNav: function(e) {
        let that = this;
        that.setData({
            currentTab: e.currentTarget.dataset.current,
            overviewList: [],
            page: 1,
            tostShow: false,
            isHide: 'none',
            off_on: false
        });
        if (e.currentTarget.dataset.current == 0) {
            var url = app.globalData.ip + '?type=illness_home&id=' + that.data.illnessId
            that.loadList(url);
        } else {
            var url = app.globalData.ip + '?type=illness_' + that.data.contype[e.currentTarget.dataset.current] + '&id=' + that.data.illnessId + '&page=' + that.data.page
            that.tabList(url);
        }
    },
    //tab切换
    tabList(url) {
        let that = this
        let Gdata = that.data.Gdata;
        let contype = that.data.contype;
        that.setData({
            overviewList: [],
            page: 1,
            tostShow: false,
            isHide: 'none',
            off_on: false
        });
        Promise.post(url, {}, 1)
            .then((res) => {
                console.log('res=', res)
                that.setData({
                    overviewList: res.data[contype[that.data.currentTab]],
                    lengthNum: res.data[contype[that.data.currentTab]].length
                })
            }).catch((res) => {
                console.log(res)
            })
    },
    //展开收起
    unfold() {
        this.setData({
            show: false,
            wrap: 'wrap'
        })
    },
    //收起
    packUp() {
        this.setData({
            show: true,
            wrap: 'nowrap'
        })
    },
    //指南展开
    guideUnfold() {
        this.setData({
            guideShow: false,
            height: '290px'
        })
    },
    //指南收起
    guidePackUp() {
        this.setData({
            guideShow: true,
            height: '190px'
        })
    },
    //跳转医生主页
    godoctorHomePage() {
        wx.navigateTo({
            url: '/pages/doctorHomePage/doctorHomePage',
        })
    },
    //更多视频
    godoctorHomevideo() {
        let that = this;
        that.setData({
            currentTab: 1,
            page: 1
        })
        var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId + '&page=' + that.data.page
        that.tabList(url);
    },
    //更多问答
    godoctorHomeanswer() {
        let that = this;
        that.setData({
            currentTab: 2,
            page: 1
        })
        var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId + '&page=' + that.data.page
        that.tabList(url);
    },
    //更多文章
    godoctorHomearticle() {
        let that = this;
        that.setData({
            currentTab: 3,
            page: 1
        })
        var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId + '&page=' + that.data.page
        that.tabList(url);
    },
    //更多音频
    godoctorHomeaudio() {
        let that = this;
        that.setData({
            currentTab: 4,
            page: 1
        })
        var url = app.globalData.ip + '?type=illness_' + that.data.contype[that.data.currentTab] + '&id=' + that.data.illnessId + '&page=' + that.data.page
        that.tabList(url);
    },
    //问答详情
    goAsk(e) {
        let that = this;
        let askId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + askId,
        })
    },
    //文章详情
    goToArticle(e) {
        let that = this;
        let articleId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/article/article?id=' + articleId,
        })
    },
    //视频详情
    goToDetails(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/video/video?videoId=' + id, //视频详情
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
    //返回首页
    goidnex() {
        var that = this
        wx.switchTab({
            url: '../index/index',
        })
    },
    //分享页面 
    onShareAppMessage: function() {
        var that = this;
        return {
            title: '民福康-' + that.data.illnessName,
            path: '/pages/disease/disease?share_query=disease' + '&diseaseId=' + that.data.illnessId + '&name=' + that.data.illnessName,
        }
    },
})