import cfg from './base.js'


/**
 * 响应拦截
 * @param {Object} http
 */
module.exports = () => {
  uni.request.interceptors.response.use(
    (response) => {
      /* 对响应成功做点什么 可使用async await 做异步操作*/
      uni.hideLoading()
      // 清除定时器，如果请求回来了，就无需loading
      clearTimeout(cfg.timer)
      cfg.timer = null
      const data = response.data
      // 自定义参数
      const custom = response.config?.custom
      if (data.httpCode !== 0) {
        // 服务端返回的状态码不等于0，则reject()
        if (
          data.httpCode === 401 &&
          !cfg.urlWhiteList401.includes(response.config?.url)
        ) {
          uni.reLaunch({
            url: '/pages/login/index'
          })
          return
        }
        // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
        if (data.httpCode !== 401 && custom.toast !== false) {
          uni.$u.toast(data.msg)
        }
        // 如果需要catch返回，则进行reject
        if (custom?.catch) {
          return Promise.reject(data)
        } else {
          // 否则返回一个pending中的promise
          return new Promise(() => {})
        }
      }

      if (response.header['X-Process-Time'] >= 2000) {
        // try {
        //   logManager.warn('slow_request', {
        //     requestId: response.header['Requestid'],
        //     time: response.header['X-Process-Time'],
        //     method: response.config.method,
        //     url: response.config.url,
        //     params: response.config.params
        //   })
        // } catch {}
      }
      return data || {}
    },
    (response) => {
      /*  对响应错误做点什么 （statusCode !== 200）*/
      return Promise.reject(response)
    }
  )
}
