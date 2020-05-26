import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '../src/lang/index'
// import './mock'
import './assets/style/style.css'
import './assets/style/global.scss'
import './utils/boost'
import './utils/create-api'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
