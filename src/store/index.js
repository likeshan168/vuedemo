import Vue from 'vue'
import Vuex from 'vuex'
// import note from './modules/note'
import MonthConfig from './modules/month_config'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        // note
        MonthConfig
    },
    strict: process.env.NODE_ENV !== 'production'
})