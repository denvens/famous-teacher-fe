import config from '../../../config';
import tools from './tools';
const {randomString, ajax, getUploadedFilePath} = tools;
const wx = window.wx;

function initWx() {
    var noncestr = randomString(8);
    var timestamp = '' + Date.now();
    timestamp = timestamp.substr(0, timestamp.length - 3);
    var url = location.href;
    if (url.indexOf('#') >= 0) {
        url = url.substr(0, url.indexOf('#'));
    };
    // 禁止移动端调整微信浏览器字体大小
    (function() {
        if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            handleFontSize();
        } else {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                document.attachEvent("onWeixinJSBridgeReady", handleFontSize);  
            }
        }
        function handleFontSize() {
            // 设置网页字体为默认大小
            WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
            // 重写设置网页字体大小的事件
            WeixinJSBridge.on('menu:setfont', function() {
                WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
            });
        }
    })();
    ajax({
        url:'/auth/js-sdk-signature',
        data:{
            noncestr:noncestr,
            timestamp:timestamp,
            url:url
        }
    }).then(res=>{
        let signature = res.data.signature.toLowerCase();
        let params = {
            debug: false,
            appId: config['APP_ID'],
            timestamp: timestamp, 
            nonceStr: noncestr, 
            signature: signature,
            jsApiList: [
                'onMenuShareAppMessage',
                'onMenuShareTimeline'
            ]
        };
        wx.config(params);
    }).catch(e=>{
        console.log(e)
    })
    
    wx.ready(function(){
        setShare();
        console.log('微信初始化');
    });
    wx.error(function(err){
        console.log(err)
    });
}

function setShare(data, callback) {
    data = data || {};
    let defaultUrl = [location.protocol, '//', location.host,location.pathname].join('');
    let url = data.shareUrl ? data.shareUrl : defaultUrl;
    let shareIconUrl = data.img ? getUploadedFilePath(data.img) : 'https://squirrel-dev.oss-cn-beijing.aliyuncs.com/images/uploads/2019-02-28/1d0cfb85-95aa-40a1-9023-66d63c62d3eb.png';
    let messageDesc = data.content || '名师优播';
    wx.onMenuShareTimeline({
        title: data.spaceTitle||'名师优播', // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareIconUrl, // 分享图标
        success: success
    });
            
    wx.onMenuShareAppMessage({
        title: data.freTitle||'名师优播', // 分享标题
        desc: messageDesc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareIconUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: success
    });
    function success() {
        callback && callback();
    }
}



export {
    initWx,
    setShare
}