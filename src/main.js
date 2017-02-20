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
import Intro from './components/Intro';
import UserList from './components/user/user_list';
import RoleList from './components/user/role_list';
import RouteList from './components/user/route_list';
import UploadData from './components/commission/upload_data';
import ExportData from './components/commission/export_data';
import CommissionCalculation from './components/commission/commission_calculation';

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
    // name: '首页',
    iconCls: 'fa fa-home',
    hidden: true,//不显示在导航中
    // leaf: true,
    children: [
      { path: '', name: '首页', component: Intro }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'fa fa-user',
    children: [
      { path: '/user_list', name: '用户列表', component: UserList, iconCls: 'fa fa-users' },
      { path: '/role_list', name: '角色列表', component: RoleList, iconCls: 'fa fa-user-circle' },
      { path: '/route_list', name: '路由列表', component: RouteList, iconCls: 'fa fa-link' },
      // { path: '/add_user', name: '新增用户' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '计提',
    iconCls: 'fa fa-calculator',
    children: [
      { path: '/upload_data', name: '导入数据', component: UploadData, iconCls: 'fa fa-cloud-upload' },
      // { path: '/export_data', name: '导出数据', component: ExportData, iconCls: 'fa fa-cloud-download' },
      { path: '/commission_calculation', name: '计算金额', component: CommissionCalculation, iconCls: 'fa fa-calculator' },
      // { path: '/add_user', name: '新增用户' }
    ]
  },

]
//3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  // console.log(sessionStorage.getItem('access_token'))
  try {
    if (!to.fullPath.startsWith("/login") && (sessionStorage.getItem('access_token') === 'undefined' || sessionStorage.getItem('access_token') === null)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // console.log(to.path);
      next();
      
    }
  } catch (error) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
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
