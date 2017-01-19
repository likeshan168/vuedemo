import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'

//1. 定义（路由）组件。
import Login from './components/login/login'
import Register from './components/register/register'

Vue.use(ElementUI)
Vue.use(VueRouter)
// 2. 定义路由
const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  }
]
//3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app');
