// pages/joins/joins.js
const db = require('../../models/db.js');
const utils = require('../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        joinCourts:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        const info = app.globalData.userInfo;
        const notOutTime = [];
        const outTime = [];
        utils.getCurrTime().then((time) => {
            db.findData().then((res) => {
                    res.map((item) => {
                        if (item.teamMate.includes(info.openId)) {
                            if (item.teamMate[0] !== info.openId) {
                                item.isTimeOut = new Date(`${item.aTime.substring(0, 4)}-${item.aTime.substring(5, 7)}-${item.aTime.substring(8, 10)} ${item.aTime.substring(11, 13)}:${item.aTime.substring(14, 16)}`) > new Date(time.header.Date) ? false : true;
                                if (item.isTimeOut) {
                                    outTime.push(item);
                                } else {
                                    notOutTime.push(item);
                                }
                            }
                        }
                    });
                    if (notOutTime.reverse().concat(outTime.reverse())[0]) {
                        this.setData({
                            joinCourts: notOutTime.concat(outTime)
                        });
                        wx.hideLoading();
                    } else {
                        wx.showToast({
                            title: '暂无加入球队',
                            icon: 'none',
                            duration: 2500,
                            success() {
                                setTimeout(() => {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }, 2500)
                            }
                        })
                    }
            }).catch(() => {
                wx.showToast({
                    title: '网络似乎开小差了',
                    icon:'none',
                    duration:2500,
                    success(){
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        },2500)
                    }
                })
            })
        })
    },
    showTip() {
        wx.showToast({
            title: '已过期，无法查看',
            icon: 'none',
            duration: 2000
        })
    }
})