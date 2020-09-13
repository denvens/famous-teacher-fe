import moment from 'moment-timezone';
import config from '../../../config';
import querystring from 'query-string';
import axios from 'axios';
import './loghub-tracking';
axios.defaults.withCredentials = true;

export default {
	ajax,
	getUrlParams,
	urlUpdater,
	randomString,
	getUploadedFilePath,
	beijingTime,
	getBeijingTimeData,
	frontendLog
}

var requestUrl = config['REQUEST_URL'];

function getUrlParams() {
	let url = location.href;
	if (url.indexOf('#') >= 0) {
		url = url.substr(0, url.indexOf('#'));
	}
	var params = url.substr(location.href.indexOf('?') + 1);
	params = params.split('&');
	var obj = {};
	for (var i = 0; i < params.length; i++) {
		var tem = params[i].split('=');
		obj[tem[0]] = decodeURIComponent(tem[1]);
	}
	return obj;
}

function ajax(options) {
	let method = options.method || 'post';
	options.data = options.data || {};
	let data = options.data || {};
	let url = '';
	let request_url = options.requestUrl || requestUrl;
	let withCredentials = options.withCredentials;
	if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
		url = options.url;
	} else {
		url = request_url + options.url;
	}
	let now = Date.now();
	if (url.indexOf('?') >= 0) {
		url += '&ts=' + now;
	} else {
		url += '?ts=' + now;
	}
	let store = null;
	if(options.url!=='/auth/sign-in-with-open-id' && options.url!=='/auth/sign-in-with-code' && options.url!=='/auth/is-signed-in'){
		store = require('../store').default;
	}
	let openId = '';
	let nickName = '';
	if(store){
		openId = store.state.app.openId;
		nickName = store.state.app.nickName;
	}
	// frontendLog({
	// 	requestUrl:url,
	// 	requestData:data,
	// 	openId:openId,
	// 	nickName:nickName
	// });
	
	return axios({
		method: method,
		url: url,
		withCredentials: withCredentials,
		data: options.contentType && options.contentType.indexOf('application/json') > -1 ? data : querystring.stringify(data),
		headers: {
			'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
		}
	}).then(res => {
		// frontendLog({
		// 	requestUrl:url,
		// 	requestData:data,
		// 	openId:openId,
		// 	nickName:nickName,
		// 	responseData:(options.url==='/user/lesson-list'||options.url==='/subject/lesson-record'||options.url.indexOf('.json')>-1)?'':res.data
		// });

		if(res.data.denied){

		    location.replace(location.href.slice(0,location.href.indexOf('#')));
		    return;
		}
		return res.data;

	}).catch(e => {
		let obj = {
			requestUrl:url,
			requestData:data,
			error:e
		}
		if(store){
			obj.openId = store.state.app.openId;
			obj.nickName = store.state.app.nickName;
		}
		frontendLog(obj);
		return e;
	})
}


function urlUpdater(url) {

	var oldUrl = url;

	var hash = '';
	var hashIndex = url.indexOf('#');
	if (hashIndex >= 0) {
		hash = url.substr(hashIndex);
		url = url.substr(0, hashIndex);
	}

	var questionIndex = url.indexOf('?');
	var params = {};
	if (questionIndex >= 0) {
		params = getUrlParams(oldUrl);
		url = url.substr(0, questionIndex);
	}

	function getUrlParams(url) {
		var urlToParse = url;
		if (urlToParse.indexOf('#') >= 0) {
			urlToParse = urlToParse.substr(0, urlToParse.indexOf('#'));
		}
		var params = urlToParse.substr(urlToParse.indexOf('?') + 1);
		params = params.split('&');
		var obj = {};
		for (var i = 0; i < params.length; i++) {
			var tem = params[i].split('=');
			obj[tem[0]] = decodeURIComponent(tem[1]);
		}
		return obj;
	}
	return {
		updateHash(newHash) {
			hash = newHash;
		},
		addQuery: function (key, value) {
			params[key] = value;
		},
		removeQuery: function (key) {
			delete params[key];
		},
		build: function () {
			var newUrl = url;
			var queryString = '';
			for (var key in params) {
				queryString = queryString || '?';
				queryString += key + '=' + encodeURIComponent(params[key]) + '&';
			};
			newUrl += queryString ? queryString.substr(0, queryString.length - 1) : '';
			newUrl += hash;
			return newUrl;
		}
	};

}

function randomString(len) {
	len = len || 5;
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
// 处理图片、音频、视频地址
function getUploadedFilePath(url) {
	let filePath = '';
	if(url){
		if (url.indexOf('http://')>-1 || url.indexOf('https://')>-1) {
			filePath =  url;
		}else{
			filePath = config['UPLOAD_FILE_URL'] + url;
		}
		if(location.href.indexOf('https://')>-1 && filePath.indexOf('https://')<0){
			filePath = filePath.replace('http://','https://');
		}
		if(/(\.png)$|(\.gif)$|(\.jpg)$|(\.jpeg)$/.test(filePath)){
			return filePath + '?x-oss-process=image/resize,w_700/format,jpg/quality,q_85';
		}
	}
	return filePath;
}

function beijingTime(timestamp, format){
	format = format || 'YYYY/M/D';
	let date = moment(timestamp).tz("Asia/Shanghai").format(format);
	return date;
}

function getBeijingTimeData(timestamp){
	let obj = {}
	obj.year = moment(timestamp).format('YYYY');
	obj.month = moment(timestamp).format('M');
	obj.day = moment(timestamp).format('D');
	return obj;
}

// 前端技术日志
function frontendLog(logData) {
	var tracker = new window.Tracker(config['ALI_LOG_HOST'], config['ALI_LOG_PROJECT'], config['ALI_LOG_STORE']);
	tracker.push('logData', JSON.stringify(logData));
	tracker.logger();
}