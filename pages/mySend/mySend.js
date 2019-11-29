// pages/mySend/mySend.js
const db = require("../../models/db.js");
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
                courtInfo:res
            })
        })
    },

    delMeet(){
        const that = this;
        wx.showModal({
            title: '是否取消本次约球',
            content: '请您确认是否取消这次约球',
            success(res) {
                if (res.confirm) {
                    const meetId = that.data.contentInfo.infoId;
                    db.cancelMeet(meetId);
                } else if (res.cancel) {
                }
            }
        })
    }
})