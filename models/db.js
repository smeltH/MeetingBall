wx.cloud.init();
const db = wx.cloud.database({});
const meetingLists = db.collection('meetingLists');
const courtData = db.collection('courtData');

// 发起约球，将数据提交到meetingLists集合
exports.addData = (data) => {
    meetingLists.add({
        // data 字段表示需新增的 JSON 数据
        data,
    }).then(res => {
        wx.showToast({
            title: '约球成功',
            icon: 'success',
            duration: 2000,
            success() {
                setTimeout(()=>{
                    wx.navigateBack({
                        delta:1
                    })
                }, 2000)
            }
        })
    }).catch((err)=>{
        wx.showToast({
            title: '数据提交错误',
            icon: 'none',
            duration: 2000
        })
    })
};

// meet页数据显示 查询数据
exports.findData = () => {
    return wx.cloud.callFunction({
        name: 'getMeetInfo',
        data: {
        }
    }).then((res) => {
        if (res.result) {
            if (res.result.data[0]) {
                return res.result.data.map((item) => {
                    let aTime = `${item.date.split('-')[0]}年${item.date.split('-')[1]}月${item.date.split('-')[2]}日${item.time.split(':')[0]}点${item.time.split(':')[1]}分`
                    Object.assign(item, { aTime });
                    return item;
                });
            }
        }
    })
};

// 查询球场数据  搜索框
exports.getCourtInfo = () => {
    return wx.cloud.callFunction({
        name: 'getCourtData',
        data: {
        }
    }).then((res)=>{
        return res.result.data;
    })
};

// 更新数据  用户申请加入时
exports.updata = (id, newData1, newData2) => {
    wx.cloud.callFunction({
        name: 'updata',
        data:{
            id,
            newData1,
            newData2
        }
    }).then((res) => {
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
        })
        setTimeout(() => {
            wx.switchTab({
                url: '/pages/home/home'
            })
        }, 2000)
    }).catch((err)=>{
        wx.showToast({
            title: '申请失败',
            icon: 'none',
            duration: 2000
        })
        setTimeout(() => {
            wx.switchTab({
                url: '/pages/meet/meet'
            })
        }, 2000)
    })
    // meetingLists.doc(id).update({
    //     // data 传入需要局部更新的数据
    //     data: {
    //         _openid: "o4Sb15V0hCmhMYt7yBzZ8N4yq-Sw",
    //         currPeople: newData1,
    //         teamMate: _.push(newData2)
    //     },
    //     success() {
    //         wx.showToast({
    //             title: '加入成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //         setTimeout(() => {
    //             wx.switchTab({
    //                 url: '/pages/home/home'
    //             })
    //         }, 2000)
    //     },
    //     fail() {
    //         wx.showToast({
    //             title: '申请失败',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //         setTimeout(() => {
    //             wx.switchTab({
    //                 url: '/pages/meet/meet'
    //             })
    //         }, 2000)
    //     }
    // })
};

// mySend页查询当前发起球场信息  通过id查询
exports.findOneCourt = (id) => {
    return (
        courtData.doc(id).get().then(res => {
            return res.data;
        })
    )
};

// 发起人取消本次约球
exports.cancelMeet = (meetId)=>{
    wx.cloud.callFunction({
        name: 'delect',
        data: {
            id: meetId
        }
    }).then((res)=>{
        wx.showToast({
            title: '取消成功',
            icon:'none',
            duration:1500,
            success(){
                setTimeout(() => {
                    wx.switchTab({
                        url: '/pages/us/us'
                    })
                },1500)
            }
        })
    })
};

exports.exitMeet = (meetId,currPeople,currUserId,agoTeamMate)=>{
    const index = agoTeamMate.indexOf(currUserId);
    const newTeam = [];
    if (index !== -1) {
        agoTeamMate.map((item) => {
            if (item !== agoTeamMate[index]) {
                newTeam.push(item);
            }
        })
    }
    wx.cloud.callFunction({
        name: 'cancel',
        data: {
            id: meetId,
            newData1: currPeople,
            newTeam
        }
    }).then((res) => {
        wx.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 1500,
            success() {
                setTimeout(() => {
                    wx.switchTab({
                        url: '/pages/us/us'
                    })
                }, 1500)
            }
        })
    })
};