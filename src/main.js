import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/ir-black.css';
hljs.registerLanguage('javascript', javascript);

import VueHighlightJS from 'vue-highlight.js';
Vue.use(VueHighlightJS);

import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount('#app');
