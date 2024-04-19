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
	return myRequest({
		url: '/weiqi/webSocket/joinOrBuildRoom?userId='+config.userId+'&roomId='+config.roomId,
		method: 'post',
		// data: config
	})}