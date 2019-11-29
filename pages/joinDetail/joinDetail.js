// pages/joinDetail/joinDetail.js]
const utils = require("../../utils/util.js");
const db = require("../../models/db.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courtInfo:null,
        content:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 通过球场id获取当前球场的相关信息
        const court = utils.getCourtInfoById(options.courtId, app);
        const currUser = app.globalData.userInfo;
        let teamMate = JSON.parse(decodeURIComponent(options.teamMate));
        let headImg = decodeURIComponent(options.headImg);
        Object.assign(options, { headImg, teamMate, userOpenId: currUser.openId});
        this.setData({
            courtInfo: court,
            content: options
        })
    },
    applyJoin() {
        if (this.data.content.currPeople*1 >= this.data.content.numbers*1) {
            wx.showToast({
                title: '人数已达上限',
                icon: 'none',
                duration: 2000
            });
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/meet/meet'
                })
            }, 2000)
            return;
        } else {
            // 该id为储存用户预约的id
            // 判断用户是否已经加入的是openId
            const id = this.data.content.infoId;
            let teamMate = this.data.content.teamMate;
            this.data.content.currPeople++;
            const currUserOpenId = this.data.content.userOpenId;
            if (teamMate.includes(currUserOpenId)) {
                wx.showToast({
                    title: '已加入该队伍了',
                    icon: 'none',
                    duration: 2000
                });
                setTimeout(() => {
                    wx.switchTab({
                        url: '/pages/meet/meet'
                    })
                }, 2000);
            } else {
                teamMate.push(currUserOpenId)
                Object.assign(this.data.content, {
                    teamMate
                });
                db.updata(id, this.data.content.currPeople, currUserOpenId);
            }
        }
    }
})