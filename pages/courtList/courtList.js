// pages/courtList/courtList.js
const utils = require('../../utils/util.js');
const app = getApp();
const skip = 5;
let count = 0;
let courts = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courtList:[],
        allCourtData:[],
        number:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        this.data.allCourtData = app.globalData.courtData;
        if (!this.data.allCourtData){
            wx.navigateBack({
                delta: 1
            });
            return;
        }
        courts = [];
        for (let i = 0; i < skip; i++) {
            courts.push(this.data.allCourtData[count + i]);
        }
        this.setData({
            courtList: courts
        });
        wx.hideLoading();
    },
    loadingMore() {
        count = count + skip;
        for (let i = 0; i < skip; i++) {
            courts.push(this.data.allCourtData[count + i]);
        }
        this.setData({
            courtList: courts
        });
    }
})