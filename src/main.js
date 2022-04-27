import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import uploader from 'vue-simple-uploader';
import router from '@/router';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(uploader);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
