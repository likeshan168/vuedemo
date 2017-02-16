import Vue from 'vue'
import Vuex from 'vuex'
import note from './modules/note'
import 'babel-polyfill';//这个是在用在不支持es6语法的浏览器上
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        note
    },
    strict: process.env.NODE_ENV !== 'production'
})