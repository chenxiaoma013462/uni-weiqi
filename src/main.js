// main.js
import uviewPlus from 'uview-plus'
// import { createPinia } from 'pinia'
// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from "./App.vue";

export function createApp() {
// const pinia = createPinia()

  const app = createSSRApp(App)
  app.use(uviewPlus)
//   app.use(pinia)
  return {
    app
  }
}
// #endif