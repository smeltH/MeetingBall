// pages/beginMeet/beginMeet.js
const utils = require('../../utils/util.js');
const app = getApp();
const db = require('../../models/db.js');
wx.cloud.init();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        numbers:0,
        date: '' || '1970-01-01',
        date_start:'',
        date_end:'',
        time:'' || '00:00',
        time_start:'',
        time_end:'',
        courts:[],
        currCourt: '' || '请选球场',
        isDisabled: false,
        courtId:"",
        today:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let court = utils.getCourtInfoById(options.id, app);
        this.data.courtId = options.id
        this.setData({
            currCourt: court.name,
            isDisabled: true
        })
        this.initTime();
    },
    del(event){
        if (event.detail.value > 100) {
            event.detail.value = ""
            wx.showToast({
                title: '最大值为100',
                icon: 'none',
                duration: 1000
            })
        }
        return "" + event.detail.value *1;
    },
    /**
     * 初始化时间
     */
    initTime(){
        const that = this;
        utils.getCurrTime().then((res) => {
            console.log(res);
            const todayTime = res.header.Date;
            console.log(todayTime);
            const timeStart = utils.toStringTime(todayTime);
            const timeEnd = utils.toStringTime(new Date(todayTime).getTime() + 7 * 24 * 60 * 60 * 1000);
            that.setData({
                date: timeStart.y_m_d,
                date_start: timeStart.y_m_d,
                date_end: timeEnd.y_m_d,
                time: timeStart.h_m
            })
        })
        // .catch(() => {
        //     wx.showToast({
        //         // title: '网络似乎开小差了',
        //         title: 'beginMeet.js   initTime发生错误',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // })
    },

    /**
     * 更新选择日期
     */
    chooseDate(option){
        const that = this;
        const date = option.detail.value;
        utils.getCurrTime().then((res)=>{
            const today = utils.toStringTime(res.header.Date);
            that.data.today = today;
            if (date === today.y_m_d) {
                that.setData({
                    time_start: today.h_m,
                    time: today.h_m,
                });
            } else {
                that.setData({
                    time: today.h_m,
                    time_start: "00:00"
                });
            }
            that.setData({
                date: date
            });
        })
    },

    /**
     * 更新具体时间
     */
    chooseTime(option) {
        if (this.data.today === this.data.date) {
            this.setData({
                time_start: this.data.time,
                time: this.data.time
            });
        } else {
            this.setData({
                time_start: "00:00",
                time: this.data.time
            });
        }
        let time = option.detail.value;
        this.setData({
            time
        });
    },

    /**
     * 预约球场信息提交
     */
    submitForm(option){
        const that = this;
        let teamMate = [];
        let { address, date, time, numbers, tips, user } = option.detail.value;
        const userInfo = this.getUserInfo();
        that.data.today = date
        if (!user) {
            wx.showToast({
                title: '请输入发起人',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if(address === '请选球场'){
            wx.showToast({
                title: '请选择球场',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if (!(numbers * 1)) {
            wx.showToast({
                title: '参与人数错误',
                icon: 'none',
                duration: 2000
            });
            return;
        };
        utils.getCurrTime().then((res) => {
            const currTime = utils.toStringTime(res.header.Date);
            Object.assign(option.detail.value, { courtId: this.data.courtId }, { y_m_d: currTime.y_m_d, h_m: currTime.h_m})
        }).catch(()=>{
            wx.showToast({
                title: '网络异常',
                icon:'none',
                duration:2000
            })
        })
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getUserData',
            // 传给云函数的参数
            data: {},
            success(res) {
                // 当前使用用户的openId
                const openId = res.result.openid;
                console.log(openId)
                const meetList = [];
                db.findData()
                .then((res) => {
                    if (res) {
                        // 请求所有的预约数据  将所有我发起的预约放入meetList
                        res.map((item) => {
                            if (item._openid === openId) {
                                meetList.push(item);
                            }
                        });
                    }
                    return meetList;
                })
                .then((meetList) => {
                    // 预约的那天日期
                    const time = that.data.today;
                    let count = 0;
                    // 将我预约的时间与今天比较  看是否之前已经预约  如果已经预约过的话count变成1
                    meetList.map((item) => {
                        if (item.date === time) {
                            count = 1;
                        }
                    })
                    return count;
                })
                .then((count) => {
                    // 已经预约过了  count = 1
                    if (count === 1) {
                        wx.showToast({
                            title: '你今天已预约了',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    return count;
                }).then((count)=>{
                    // 没有预约的话即可发起预约
                    if (count === 0) {
                        // 将用户信息添加到数据库
                        teamMate.push(openId);
                        Object.assign(option.detail.value, { openId: openId, currPeople: 1, teamMate }, userInfo);
                        console.log(option.detail.value)
                        db.addData(option.detail.value);
                    }
                })
            },
            fail(){
                wx.showToast({
                    title: "球场预约失败~",
                    icon:"none",
                    duration:2000,
                    success() {
                        wx.navigateBack({
                            delta: 2
                        })
                    }
                });
            }
        });
    },
    getUserInfo(){
        return app.globalData.userInfo;
    }
})