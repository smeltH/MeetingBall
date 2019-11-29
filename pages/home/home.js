// 百度地图的key值
const utils = require('../../utils/util.js');
const key = 'oMWjSSW9tqSg76z7yzUa8QMPqgnxbgCf';
const db = require('../../models/db.js');
const app = getApp();
const page = 20;
const host = "localhost";
let number = 0;
Page({
    data: {
        inputValue:'',
        area: '武汉',// 当前位置所属行政区
        showFourCourts: [],// 首页四个球场推荐
        latLon: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    
    onLoad: function () {
        // 获取当前定位然后去查询数据
        utils.getLocation().then((res) => {
            wx.showLoading({
                title: '加载中',
            })
            let that = this;
            let count = 0;
            // 获取当前你所在地方区域属于什么区
            const lat = res.latitude,
                  lng = res.longitude;
            that.getArea(lat, lng);
            wx.cloud.callFunction({
                name: 'distance',
                data: {
                    lat,
                    lng
                }
            }).then((data) => {
                let result = data.result.sort((a,b)=>{
                    return a.distance - b.distance >= 0 ? 1 : -1;
                });
                let courtData = result.map((item)=>{
                const encodeImg = encodeURIComponent(item.imgUrl);
                    return Object.assign(item, { encodeImg }, { telephone: item.telephone || "暂无电话", overall_rating: (item.overall_rating * 1 ? item.overall_rating * 1+'分': item.overall_rating * 1) || "暂无评分"});
                })
                app.globalData.courtData = courtData;
                
                this.setData({ showFourCourts: [courtData[0], courtData[1], courtData[2], courtData[3]]})
            }).then(()=>{
                wx.hideLoading()
            }).catch(() => {
                wx.showToast({
                    title: '网络似乎开小差了',
                    icon: 'none',
                    duration: 2000
                })
            })
        });
    },
    /*
     * 作用：
     *       获取当前您所在的区域
     * 参数：
     *       latitude:经度
     *       longitude:纬度
     */
    getArea(latitude, longitude) {
        let area = "";
        let url = 'https://api.map.baidu.com/geocoder/v2/?location=' + latitude + ',' + longitude + '&output=json&pois=0&latest_admin=1&ak=' + key;
        utils.query(url).then((res) => {
            area = res.data.result.addressComponent.district
            this.setData({
                area
            })
            this.data.area = area;
        }).catch((err) => {
            wx.showToast({
                title: '网络似乎开小差了',
                icon: 'none',
                url:'/pages/home/home'
            })
            this.setData({
                area:'未更新'
            })
        })
    },

    /*
     * 搜索框的传值
     * */
    searchCourt(e) {
        const that = this;
        const key = e.detail.value.courtName;
        if (!key) {
            wx.showToast({
                title: '请正确输入',
                icon: 'none',
                duration: 2000
            });
        } else {
            db.getCourtInfo().then((res)=>{
                let courtIds = [];
                res.map((item)=>{
                    if (item.address.includes(key) || item.area.includes(key) || item.name.includes(key)){

                        courtIds.push(item._id);
                    }
                });
                if (courtIds[0]) {
                    wx.navigateTo({
                        url: '/pages/courtDetail/courtDetail?courts=' + encodeURIComponent(courtIds)
                    });
                }else{
                    wx.showToast({
                        title: '未找到相关信息',
                        icon:'none',
                        duration:2000
                    })
                }
                that.setData({
                    inputValue: ''
                })
            });
        }
    }
})