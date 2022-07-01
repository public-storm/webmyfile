import Vue from 'vue'
import App from './App.vue'
import router from '@/router';
import myIcon from '@/components/MyIcon.vue';
import progressPar from '@/components/ProgressPar';
import Vuesax from 'vuesax'


import 'vuesax/dist/vuesax.css' //Vuesax styles
Vue.use(Vuesax, {
    // options here
})
Vue.config.productionTip = false
Vue.component('my-icon', myIcon);
Vue.component('progress-par', progressPar);
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')



