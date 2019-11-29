wx.cloud.init();
const key = 'Na7moN2mW4lpBcSct3atF6D5slu8dZHK';

let num = 10,
    page = 0;
const app =getApp();
module.exports = {
    /*
     *  功能：
     *       数据请求
     *  参数
     *       queryUrl：请求url
     */
    query(queryUrl,data,method) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: queryUrl,
                data: data || "",
                method: method || "GET",
                success: resolve,
                fail: reject
            });
        });
    },

    /*
     *  功能：
     *       获取当前位置
     */
    getLocation() {
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'wgs84',
                success: resolve,
                fail: reject
            });
        })
    },

    getUserInfo(that){
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                wx.cloud.callFunction({
                    name: 'getUserData',
                    data: {
                    }
                }).then((data) => {
                    Object.assign(res.data, { openId: data.result.openid })
                }).then(() => {
                    wx.switchTab({
                        url: '/pages/home/home',
                    });
                    that.globalData.userInfo = res.data;
                })
            },
            fail:function(){
                wx.reLaunch({
                    url: '/pages/beginView/beginView',
                });
            }
        })
    },

    /*
     *  传入json数据，将数据转为key1=value1&key2=value2
     * */
    JsonToStr(json){
        let key = Object.keys(json);
        let value = Object.values(json);
        
        let valKey = value.map((item,index)=>{
            return key[index]+"="+encodeURIComponent(item);
        });
        let str = valKey.join('&');
        return str;
    },
    getCourtInfoById(id, app){
        let data = app.globalData.courtData;
        let court = null;
        data.map((item)=>{
            if(item._id === id){
                court = item;
                return;
            };
        })
        return court;
    },
    toStringTime(date) {
        const currDate = new Date(date);
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1 > 9 ? currDate.getMonth() + 1 : '0' + (currDate.getMonth() + 1);
        const day = currDate.getDate() > 9 ? currDate.getDate() : '0' + currDate.getDate();
        const hour = currDate.getHours() > 9 ? currDate.getHours() : '0' + currDate.getHours();
        const min = currDate.getMinutes() > 9 ? currDate.getMinutes() : '0' + currDate.getMinutes();
        const y_m_d = `${year}-${month}-${day}`;
        const h_m = `${hour}:${min}`;
        return { y_m_d, h_m }
    },
    getCurrTime() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: 'https://www.baidu.com/',
                method: 'HEAD',
                success: resolve,
                fail: reject
            })
        })
    }
}