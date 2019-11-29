// pages/currentCourt/currentCourt.js
const utils = require("../../utils/util.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courtInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let court = utils.getCourtInfoById(options.id, app);
        // console.log(court)
        // let url = decodeURIComponent(court.encodeImg);
        // let data = Object.assign(court, { getUrl: url });
        // this.setData({
        //     address: court.address,
        //     name: court.name,
        //     distance: court.distance < 1000 ? court.distance * 1000 + 'M' : court.distance+'KM',
        //     imgUrl: court.getUrl,
        //     address: court.address,
        //     lat: court.lat,
        //     lng: court.lng,
        //     tel: court.telephone || "暂无电话",
        //     comment: court.overall_rating || "暂无评分"
        // })
        this.setData({
            courtInfo: court
        })
    }
})