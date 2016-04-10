'use strict';



exports.compiled = function(message) {
    var typeTpl = '';

    switch (message.msgType) {
        case 'text':
            typeTpl = `<Content><![CDATA[${ message.content }]]></Content>`;
            break;
        case 'image':
            typeTpl = `<Image>
<MediaId><![CDATA[${ message.content.mediaId }]]></MediaId>
</Image>`;
            break;
        case 'voice':
            typeTpl = `<Voice>
<MediaId><![CDATA[${ message.mediaId }]]></MediaId>
</Voice>`;
            break;
        case 'video':
            typeTpl = `<Video>
<MediaId><![CDATA[media_id]]></MediaId>
<Title><![CDATA[title]]></Title>
<Description><![CDATA[description]]></Description>
</Video>`;
            break;
        case 'music':
            typeTpl = `<Music>
<Title><![CDATA[${ message.title }]]></Title>
<Description><![CDATA[${ message.description }]]></Description>
<MusicUrl><![CDATA[${ message.musicUrl }]]></MusicUrl>
<HQMusicUrl><![CDATA[${ message.HQMusicUrl }]]></HQMusicUrl>
<ThumbMediaId><![CDATA[${ message.ThumbMediaId }]]></ThumbMediaId>
</Music>`;
            break;
        case 'news':
            var items = ``;
            for (var item in message.content) {
                items += `<item>
<Title><![CDATA[${ message.content[item].title }]]></Title> 
<Description><![CDATA[${ message.content[item].description }]]></Description>
<PicUrl><![CDATA[${ message.content[item].picUrl }]]></PicUrl>
<Url><![CDATA[${ message.content[item].url }]]></Url>
</item>`;
            }

            typeTpl = `<ArticleCount>${ message.content.length }</ArticleCount>
<Articles>
${ items }
</Articles>`;
            break;

    }


    var tpl = `<xml>
<ToUserName><![CDATA[${ message.toUserName }]]></ToUserName>
<FromUserName><![CDATA[${ message.fromUserName }]]></FromUserName>
<CreateTime>${ message.now }</CreateTime>
<MsgType><![CDATA[${ message.msgType }]]></MsgType>
${ typeTpl }
</xml>`;

    return tpl;
};
