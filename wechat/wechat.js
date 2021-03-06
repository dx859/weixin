'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var request = Promise.promisify(require('request'));
var util = require('./util');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'
};

function Wechat(opts) {
    this.appID = opts.appID;
    this.appsecret = opts.appsecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.fetchAccessToken();
}

Wechat.prototype.isValidAccessToken = function(data) {

    if (!data || !data.access_token || !data.expires_in) {

        return false;
    }

    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = Date.now();

    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
};

Wechat.prototype.updateAccessToken = function() {
    var appID = this.appID;
    var appsecret = this.appsecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appsecret;

    return new Promise((resolve, reject) => {

        request({ url: url, json: true }).then((response) => {

            var data = response.body;
            var now = Date.now();
            var expires_in = now + (data.expires_in - 20) * 1000;

            data.expires_in = expires_in;
            resolve(data);

        });
    });

};

Wechat.prototype.fetchAccessToken = function() {
    var self = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {

            return Promise.resolve(this);
        }
    }

    self.getAccessToken()
        .then((data) => {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return self.updateAccessToken();
            }

            if (self.isValidAccessToken(data)) {
            
                return Promise.resolve(data);
            } else {

                return self.updateAccessToken();
            }
        })
        .then((data) => {
            self.access_token = data.access_token;
            self.expires_in = data.expires_in;

            self.saveAccessToken(data);
       
            return Promise.resolve(data);
        });
};

Wechat.prototype.uploadMaterial = function(type, filepath) {
    var self = this;
    var form = {
        media: fs.createReadStream(filepath)
    };

    var appID = this.appID;
    var appsecret = this.appsecret;

    return new Promise(function(resolve, reject) {
        self
            .fetchAccessToken()
            .then(function(data) {

                var url = api.upload + 'access_token=' + data.access_token + '&type=' + type
                request({ method: 'POST', url: url, formData: form, json: true }).then((response) => {

                    var _data = response.body;
             
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('upload material fails');
                    }

                })
                .catch((err) => {
                    reject(err);
                })
            });

    });
}

Wechat.prototype.reply = function() {
    var content = this.body;
    var message = this.msg;

    var xml = util.tpl(content, message);

    this.status = 200;
    this.type = 'application/xml';
    console.log(xml);
    this.body = xml;
};

module.exports = Wechat;