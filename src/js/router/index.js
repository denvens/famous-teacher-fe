import VueRouter from 'vue-router';
import main from './main';
import course from './course';
import calendar from './calendar';
import mine from './mine';
import share from './share';
import clear from './clear';

const routes = [
    ...main,
    ...course,
    ...calendar,
    ...mine,
    ...share,
    ...clear
]
const router = new VueRouter({
    routes,
    mode: 'hash'
});

router.beforeEach((to, from, next) => {
    if(from.path==='/'&&to.path.indexOf('/course/question')>-1){
        next('/main')
        return;
    }
    if(from.path==='/'&&to.path.indexOf('/course/success')>-1){
        next('/main')
        return;
    }
    next()
});
export default router;