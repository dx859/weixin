'use strict';
var path = require('path');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');

var config = {
    wechat: {
        appID: 'wx715a191b5ad57acd',
        appsecret: 'e78665b83160d82906e33cb31bd30dd7',
        token: 'daixi33213ddzzyy',
        getAccessToken: () => {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: (data) => {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        }
    }
};

module.exports = config;