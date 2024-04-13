let baseURL = '';
// 是否在控制台显示接口请求日志,本地环境启用,打包环境禁用
let showHttpLog = false;
baseURL = 'http://193.112.190.204:5000/api';  // 测试环境 
const cfg = {
		showLoading: true,
		loadingTime: 500,
		loadingText: '加载中',
		loadingMask: false,
		urlNoLoading: ['/user_trace'],
		urlWhiteList401: ['/user_trace'],
		custom: {
			catch: true
		},
}
export {
	baseURL,
	showHttpLog,cfg
};
