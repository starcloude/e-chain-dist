// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import '@/asstic/http.js'
import '@/assets/common.css'
import { Toast } from 'vant';

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Toast);
Toast.setDefaultOptions({ duration: 2000 });
Vue.use(Vant);
Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
