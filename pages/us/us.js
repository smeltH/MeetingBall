// pages/us/us.js
const utils = require("../../utils/util.js");
const db = require("../../models/db.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sendData:null,
        joinData:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        const info = app.globalData.userInfo;
        that.setData({
            userInfo: info,
        })
    },
    mySend(){
        wx.navigateTo({
            url: '/pages/sends/sends',
        })
    },
    myJoin() {
        wx.navigateTo({
            url: '/pages/joins/joins',
        });
    }
})