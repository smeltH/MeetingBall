// pages/myJoin/myJoin.js
const db = require('../../models/db.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.findOneCourt(options.courtId).then((res) => {
            if (options.y_m_d && options.h_m) {
                options.y_m_d = options.y_m_d.substring(0, 4) + '年' + options.y_m_d.substring(5, 7) + '月' + options.y_m_d.substring(8, 10) + '日';
                options.h_m = options.h_m.substring(0, 2) + '点' + options.h_m.substring(3, 5) + '分';
            }
            this.setData({
                contentInfo: options,
                courtInfo: res
            })
        })
    },

    exitMeet() {
        const that = this;
        wx.showModal({
            title: '是否退出该球队',
            content: '请您确认是否退出该球队',
            success(res) {
                const userId = app.globalData;
                if (res.confirm) {
                    // 当前预约信息id
                    const meetId = that.data.contentInfo.infoId;
                    const updataPeople = that.data.contentInfo.currPeople-1;
                    const agoTeam = that.data.contentInfo.teamMate.split(',');
                    const currUserId = app.globalData.userInfo.openId;
                    db.exitMeet(meetId, updataPeople, currUserId, agoTeam);
                } else if (res.cancel) {
                }
            }
        })
    }
})