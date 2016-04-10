'use strict';

var config = require('../config');
var Wechat = require('./wechat');

var wechatApi = new Wechat(config.wechat);

exports.reply = function*(next) {
    var message = this.msg;

    if (message.MsgType === 'event') {
        // 关注事件
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码进来：' + message.EventKey + ' ' + message.ticket);
            }

            this.body = '哈哈，你订阅了这个号\r\n ';
        } else if (message.Event === 'unsubscribe') { // 取消关注
            this.body = '';
            console.log('无情取消关注');
        } else if (message.Event === 'LOCATION') {
            this.body = `您上报的位置是：${message.Latitude}/${message.Longitude}-${message.EventKey}`;
        } else if (message.Event === 'CLICK') {
            this.body = '您点击了菜单：' + message.EventKey;
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫描二维码：' + message.EventKey + ' ' + message.Ticket);
            this.body = '看到你扫了一下哦';
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接：' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        var content = message.Content;
        var reply = '额，你说的 ' + message.Content + '太复杂了';

        if ('1' === content) {
            reply = '您回复的是1';
        } else if ('2' === content) {
            reply = '天下第二大厦';
        } else if ('3' === content) {
            reply = '天下第四大傻';
        } else if ('4' === content) {
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl: 'http://img.365tmm.com/uploads/shops/actives/20160409/litimg_app/20025708f7d3d3b058.15111217.jpg',
                url: 'http://wx.365tmm.com/#/tuijian'
            }]
        } else if ('5' === content) {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
            reply = {
                type: data.type,
                mediaId: data.media_id
            }
        } else if ('6' === content) {
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/2.mp4');
            reply = {
                type: data.type,
                title: '回复视频内容',
                description: '这是一个描述',
                mediaId: data.media_id
            }
        } else if ('7' === content) {
            var data = yield wechatApi.uploadMaterial('music', __dirname + '/2.mp3');
            reply = {
                type: data.type,
                title: '回复音乐内容',
                description: '放松一下',
                musicUrl: '',
                thumbMediaId: data.media_id
            }
        }

        this.body = reply;
    }

    yield next;
};
