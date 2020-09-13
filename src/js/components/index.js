import Vue from 'vue';
// import Entry from '../pages/entry';

// Vue.component('Entry', Entry);
Vue.component('headerBar',resolve=>require(['./headerBar'],resolve))
Vue.component('player',resolve=>require(['./audioPlayer'],resolve))
Vue.component('questionSelect',resolve=>require(['./questionSelect'],resolve))
Vue.component('tip',resolve=>require(['./tip'],resolve))
Vue.component('Share',resolve=>require(['../pages/share'],resolve))
Vue.component('Entry',resolve=>require(['../pages/entry'],resolve))
Vue.component('Paragraph',resolve=>require(['./paragraph'],resolve))
