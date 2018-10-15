import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import VueHighlightJS from 'vue-highlightjs';
Vue.use(VueHighlightJS);

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
