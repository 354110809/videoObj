// import Vue from 'vue'
import App from './App.vue'
import store from './store'

// vue 本地储存
import Storage from 'vue-ls';
let options = {
	namespace: 'MSB_', // key值前缀
	name: 'ls', // 别名 Vue.[ls] or this.[$ls],
	storage: 'local', // storage name session, local, memory
};
Vue.use(Storage, options);

// 路由
import router from './router/index'
// 路由跳转前后验证
import "./router/routerVerification.js";

// UI组件
import ViewUI from 'view-design';
// import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

// loading
import loading from "./components/Loading/index.js";
Vue.use(loading);
import BWDMODEL from "./components/bwdModel/index.js";
Vue.use(BWDMODEL);

// api 配置模块
import { API, httpApi , PICURL } from './utils/api'
// 请求插件
import axios from './utils/axiosAjax'
Vue.prototype.API = API;
Vue.prototype.httpApi = httpApi;
Vue.prototype.PICURL = PICURL;
Vue.prototype.axios = axios;

// 重设公共样式
import './assets/css/reset.css'

// vue-meta
// import VueMeta from 'vue-meta'
// Vue.use(VueMeta)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
