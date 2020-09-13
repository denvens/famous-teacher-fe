import configData from '../../config';

window.config = function (key) {
    if (typeof configData[key] === 'function') {
        return configData[key]();
    }
    return configData[key];
};
import tools from './modules/tools';
let {ajax, getUrlParams, urlUpdater,frontendLog} = tools;
//openid : obR2_v3meOcjFCKAfDzAn3c1J-cs
let urlParams = getUrlParams();
let isPublic = urlParams['public'] === 'true';
let signInAs = config('DEFAULT_USER') || urlParams['openId'];
let code = urlParams['code'];
if(isPublic){
    require.ensure(['./app'], require => {
        let {satrtShare} = require('./app').default;
        satrtShare();
    });
}else if(signInAs){

    ajax({
        url:'/auth/sign-in-with-open-id',
        data:{
            openId:signInAs
        }
    }).then(handleSignInData).catch(e=>{
        alert(e)
    })
}else if(code){
    frontendLog({
        code:code,
        locationUrl:location.url
    })
    ajax({
        url:'/auth/sign-in-with-code',
        data:{
            code:code
        }
    }).then(handleSignInData).catch(e=>{
        // alert('登录失败！')
        alert(221)
    })
}else{
    // ajax({
    //     url:'/auth/is-signed-in',
    // }).then(signedIn).catch(fetchCode)
}

function signedIn(ret){
    // frontendLog({
    //     requestUrl:'/auth/is-signed-in',
    //     responseData:ret
    // })
    // if(ret.success){
    //
    //     handleSignInData(ret)
    //     return;
    // }
}

function handleSignInData(ret) {
   // alert(JSON.stringify(ret))
    if (urlParams['openId'] || urlParams['code']) {

        let redirect = urlUpdater(location.href);
        redirect.removeQuery('openId');
        redirect.removeQuery('code');
        redirect = redirect.build();

        if(!ret.success){
            location.href = redirect;
            return;
        }

        // 移除url上的相关参数
        // setTimeout(function () {
        //     alert(redirect)
        //     location.replace(redirect);
        // }, 150);
        // return;
    }

    console.log(ret)

    require.ensure(['./app'], require => {
        let {startApp} = require('./app').default;
        startApp(ret.data);
    });
}


function fetchCode() {
    let redirect = encodeURIComponent(location.href);
    let scope = isPublic?'snsapi_base':'snsapi_userinfo';
    let url = [
        'https://open.weixin.qq.com/connect/oauth2/authorize',
        '?appid=',
        configData['APP_ID'],
        '&redirect_uri=',
        redirect,
        '&response_type=',
        'code',
        '&scope=',
        scope,
        '&state=',
        'NOTUSED',
        '#wechat_redirect'
    ].join('');

    location.replace(url);
}
