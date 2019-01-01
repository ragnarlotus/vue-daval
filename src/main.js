import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);

import javascript from 'highlight.js/lib/languages/javascript';
import vue from 'vue-highlight.js/lib/languages/vue';
import 'highlight.js/styles/ir-black.css';

import VueHighlightJS from 'vue-highlight.js';
Vue.use(VueHighlightJS, {
	languages: {
		javascript,
		vue
	}
});

import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount('#app');
