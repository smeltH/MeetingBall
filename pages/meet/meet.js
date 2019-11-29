// pages/meet/meet.js
let utils = require('../../utils/util.js');
let db = require('../../models/db.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courts:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        wx.showLoading({
            title: '加载中',
        })
    },
    onShow() {
        this.refreshPage();
    },
    refreshPage() {
        const notMistake = [];
        db.findData().then((res)=>{
            if (res[0]) {
                utils.getCurrTime().then((time) => {
                    let meetInfo = res.map((item) => {
                        Object.assign(item, {
                            isTimeOut:
                                new Date(time.header.Date) >
                                    new Date(`${item.aTime.substring(0, 4)}-${item.aTime.substring(5, 7)}-${item.aTime.substring(8, 10)} ${item.aTime.substring(11, 13)}:${item.aTime.substring(14, 16)}`) ? true : false
                        }
                        )
                        if (item.h_m && item.y_m_d) {
                            item.h_m = item.h_m.substring(0, 2) + '点' + item.h_m.substring(3, 5) + '分';
                            item.y_m_d = item.y_m_d.substring(0, 4) + '年' + item.y_m_d.substring(5, 7) + '月' + item.y_m_d.substring(8, 10) + '日';
                        } else {
                            item.h_m = ""
                            item.y_m_d = ""
                        }
                        Object.assign(item, { headImg: encodeURIComponent(item.avatarUrl), oId: encodeURIComponent(item.openId), teamMate: encodeURIComponent(JSON.stringify(item.teamMate)) })
                        return item;
                    });
                    return meetInfo;
                }).then((data) => {
                    data.map((item) => {
                        if (!item.isTimeOut) {
                            notMistake.push(item);
                        }
                    })
                    return notMistake;
                }).then((data) => {
                    this.setData({
                        courts: data.reverse()
                    });
                }).catch(() => {
                    wx.showToast({
                        title: '网络似乎开小差了', 
                        icon: 'none',
                        duration: 2000,
                        success() {
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: '/pages/home/home',
                                })
                            }, 2000)
                        }
                    })
                })
            } else {
                wx.showToast({
                    title: '网络似乎开小差了', 
                    icon: 'none',
                    duration: 2000,
                    success() {
                        wx.switchTab({
                            url: '/pages/home/home'
                        })
                    }
                })
            }
        }).then(() => {
            wx.hideLoading()
        })
    }
})