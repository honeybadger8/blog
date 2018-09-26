/*
* @authors :平头哥联盟-首席填坑官(苏南)
* @date    :2018-09-26
* @description：平头哥联盟项目示例源码,欢迎投稿讲出你的故事
* @github：https://honeybadger8.github.io/blog/


* 使用示例：
	fetchJson({
		url:"https://dev.ali.com/tuan/service/questionnaire1.html",
		data:{},
		type:"get",
		header:{
			...args
		},
	}).then(res=>{
		console.log(res);
	}).catch((err)=>{
		console.log(err)
	});
*/

import wepy from 'wepy'
import config,{__DEBUG__} from './config';
import 'wepy-async-function';
import Storage from "./storage.js";

let StaticToast = null;



export const  fetchJson = (options)=>{
	/*
	 *  请求前的公共数据处理
	 * @ param {String} 	url 请求的地址
	 * @ param {String} 	Type 请求类型
	 * @ param {String} 	sessionId 用户userToken
	 * @ param {Boolean} 	openLoad 开启加载提示，默认开启，true-开，false-关
	 * @ param {function} StaticToast 静态提示方法 ,详细说明请参考 components/ui/Toast
	 * @ param {Object} 	header 重置请求头
	*/

	StaticToast = getCurrentPages()[getCurrentPages().length - 1];
	let { url,openLoad=true, type, data={},header={}, ...others } = options||{};
	let sessionId = (Storage.get('_userToken')||"");
    var regExp = /\/(.*?)\//,
        hostkey = url.match(regExp)[1];
	let baseUrl = config.baseAPI[hostkey].host;
	url = url.replace(regExp, '/');
	__DEBUG__&&console.log('#--baseUrl:', baseUrl);
	__DEBUG__&&console.log('#--请求地址:', `${baseUrl}${url}`);
	__DEBUG__&&console.log('----------分割线---------------');
	openLoad&&StaticToast.__showLoading__();
	return new Promise((resolve, reject) => {
		return wepy.request({
			url:`${baseUrl}${url}`,
			method:(type || 'POST'),
			data,
			header:{
				"token":sessionId,
				'platform': 'w3c**app',
         'access-token': sessionId,
				'content-type': 'application/json',
				// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				...header
			},
			success:(res)=>{
				StaticToast.__hideLoading__();
				return resolve(resHandler(res,options));
			},
			error:(err,status)=>{
				StaticToast.__hideLoading__();
				return reject(errorHandler(err,options,err.statusCode));
			}
		});
	})
	
}

// 请求成功处理
function resHandler(resData, options) { 
	if (resData.statusCode && resData.statusCode != 200) {
		return errorHandler(resData, options, resData.statusCode);
	};
	if(resData&&(resData.data.code == 3 || resData.data.code== 2002 || resData.data.errorCode == 3 || resData.data.errorCode== 2002)){ //未登录｜｜登录失效

		//token已过期的约定，重新发起登录
		__DEBUG__&&console.log(`登录失效 ### 添加请求队列，${options}`);
	
		return Promise.resolve(resData);

	}else if(resData.data.errorCode == 10000){
		return Promise.resolve(resData);
	}
	else if(!resData || resData&&(resData.data.code > 20000||resData.data.errorCode > 0)) {
		options.error && options.error(resData);
		StaticToast.__info__([resData.data.message]);
		// saveError(`#接口请求异常：${options.url}`,resData.data);
		return Promise.resolve(resData);
	} else {
		options.success && options.success(resData.data);
		return Promise.resolve(resData.data);
	};

}

// 异常处理
function errorHandler(error={}, options={}, status='') {
	options.error && options.error(error.data);
	StaticToast.__info__([`网络异常，请稍后重试(${status})`]);
	// saveError(`接口请求出错：${options.url}`,{...error,status});
	return Promise.reject(error);
}




