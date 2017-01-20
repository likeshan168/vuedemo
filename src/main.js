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
import Home from './components/Home';
import UserList from './components/user/user_list';

Vue.use(ElementUI)
Vue.use(VueRouter)
// 2. 定义路由
const routes = [
  {
    path: '/login',
    component: Login,
    hidden: true//不显示在导航中
  },
  {
    path: '/register',
    component: Register,
    hidden: true//不显示在导航中
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'fa fa-user',
    children: [
      { path: '/user_list', name: '用户列表', component: UserList },
      // { path: '/add_user', name: '新增用户' }
    ]
  }
]
//3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
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
