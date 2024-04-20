import {
	myRequest
} from '../request/http.js'; //导入接口的前缀地址
 
//登录
export function login(config) {
	return myRequest({
		url: '/weiqi/login',
		method: 'post',
		data: config
	})}
//注册
export function register(config) {
	return myRequest({
		url: '/weiqi/register?phone='+config.phone+'&userId='+config.userId+'&wechatName='+config.wechatName,
		method: 'post',
		// data: config
	})}
// 获取openId
export function getOpenId(config) {
	return myRequest({
		url: '/weiqi/anonymity/v1/wxCodeToSession',
		method: 'get',
		data: config
	})}
// 获取openId
export function socketSendMsg(config) {
	return myRequest({
		url: '/weiqi/webSocket/sendMsg',
		method: 'post',
		data: config
	})}
// 创建/加入房间
export function joinOrBuildRoom(config) {

		//构建基本的URL
    let url = '/weiqi/webSocket/joinOrBuildRoom?userId=' + config.userId;

    // 检查config.roomId是否存在，并在URL中添加它（如果存在）
    if (config.roomId) {
        url += '&roomId=' + config.roomId;
    }

    // 发起请求
    return myRequest({
        url: url,
        method: 'post',
        // data: config
    });
	}