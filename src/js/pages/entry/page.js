import './page.scss'
import template from './page.tpl';
export default {
    template,
    data() {
        return {
            tabMenuList:[
                {
                    icon:require('../../../imgs/main.png'),
                    activeIcon:require('../../../imgs/main-active.png'),
                    text:'首页',
                    path:'/main'
                },{
                    icon:require('../../../imgs/calendar.png'),
                    activeIcon:require('../../../imgs/calendar-active.png'),
                    text:'日历',
                    path:'/calendar/index'
                },{
                    icon:require('../../../imgs/mine.png'),
                    activeIcon:require('../../../imgs/mine-active.png'),
                    text:'我的',
                    path:'/mine/index'
                },
            ],
            routerList:['/main','/calendar/index','/mine/index']
        }
    },
    computed: {

    },
    mounted() {
        
    },
    computed: {

    },
    methods: {
        clickTab(data){
            if(data.path===this.$route.path){
                return;
            }
            this.$router.push(data.path)
        }
    }
}
