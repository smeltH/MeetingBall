// pages/nearCourt/nearCourt.js
const key = 'Na7moN2mW4lpBcSct3atF6D5slu8dZHK';
const utils = require('../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courtMessage:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let courts = [];
        let courtIds = decodeURIComponent(options.courts).split(',');
        courtIds.map((item)=>{
            const court = utils.getCourtInfoById(item,app);
            courts.push(court);
        });
        courts = courts.sort((a,b)=>{
            return a.distance - b.distance;
        })
        this.setData({
            courtMessage: courts
        })
    }
})