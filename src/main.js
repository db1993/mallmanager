// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MyBread from '@/components/myBread.vue'
import HttpTool from '@/plugins/http.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'
import router from './router'
import moment from 'moment'


Vue.use(HttpTool)
Vue.use(ElementUI)

// 过滤器  时间格式
Vue.filter('fmtDate', function(v) {
  return moment(v).format('YYYY-MM-DD')
})

Vue.component(MyBread.name,MyBread )

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
