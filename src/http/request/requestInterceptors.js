import cfg from './base.js'
/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
  uni.request.interceptors.request.use(
    (config) => {
      // 可使用async await 做异步操作
      if (
        cfg.showLoading &&
        !cfg.urlNoLoading.includes(config.url) &&
        !cfg.timer
      ) {
        cfg.timer = setTimeout(() => {
          uni.showLoading({
            title: cfg.loadingText,
            mask: cfg.loadingMask
          })
          cfg.timer = null
        }, cfg.loadingTime)
      }
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {}
      // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
      // console.log(vm.$store.state);
      const token =
        config.header['token'] || uni.getStorageSync('token') || ''
      if (token) {
        config.header['Authorization'] = `Bearer ${token}`
      }

      delete config.header['token']
      return config
    },
    (
      config // 可使用async await 做异步操作
    ) => Promise.reject(config)
  )
}
