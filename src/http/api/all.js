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
//登录
export function register(config) {
	return myRequest({
		url: '/weiqi/register?phone='+config.phone+'&userId='+config.password,
		method: 'post',
		// data: config
	})}
