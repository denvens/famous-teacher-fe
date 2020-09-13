import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import '../css/core.scss';
// import App from './pages/entry';
import {initWx} from './modules/wechat';
import './components/index';
import config from '../../config';
import VConsole from './modules/vconsole.min.js';
import tool from './modules/tools';
Vue.use(Vuex);
Vue.use(VueRouter);
if(config['VCONSOLE']){
    
    const vConsole = new VConsole();
}

const urlParams = tool.getUrlParams();


export default {
    startApp(data) {
        let store = require('./store').default;
        let router = require('./router').default;
        store.commit('app/setUserData',data);
        initWx();
        if (!urlParams['lessonkey'] && !urlParams['ticketNumber']) {
            tool.ajax({
                url:'/user/get-effective-level-list'
            }).then(res=>{
                if (res.success) {
                   if (res.data.length == 0) {
                     router.replace('/');
                   } 
                }
            }).catch(e=>{
                console.log(e)
            })
		}

        const app = new Vue({
            store,
            router
        }).$mount('#container');
    },
    satrtShare(){
        let store = require('./store').default;
        let router = require('./router').default;
        const app = new Vue({
            store,
            router
        }).$mount('#share');
    }
}
