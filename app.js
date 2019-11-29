//app.js
const utils = require("./utils/util.js");
App({
    globalData:{
        openId:'',
        urlPath:'',
        host:"localhost",
        userInfo:null
    },
    onLaunch(option){
        utils.getUserInfo(this);
    }
});