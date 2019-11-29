// pages/beginView/beginView.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        skipView:null,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let that = this;
        // wx.getSetting({
        //     success(res) {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //             that.userInfo().then((res) => {
        //                 that.getOpenId().then((res) => {
        //                     Object.assign(res.userInfo, { openId: res.result.openid });
        //                     app.globalData.userInfo = res.userInfo;
        //                 });
        //             }).catch((err) => {
        //                 wx.switchTab({
        //                     url: '/pages/home/home'
        //                 })
        //             });
        //         }
        //     }
        // })
    },
    userInfo() {
        return new Promise((resolve,reject)=>{
            wx.getUserInfo({
                success: resolve,
                fail:reject
            });
        })
    },
    bindGetUserInfo(e) {
        this.getOpenId().then((res) => {
            Object.assign(e.detail.userInfo, { openId: res.result.openid })
            app.globalData.userInfo = e.detail.userInfo;
            wx.setStorage({
                key: 'userInfo',
                data: e.detail.userInfo,
            })
        }).then(() => {
            wx.switchTab({
                url: "/pages/home/home"
            })
        })
    },
    getOpenId() {
        return (
            wx.cloud.callFunction({
                name: 'getUserData',
                data: {
                }
            })
        )
    }
})