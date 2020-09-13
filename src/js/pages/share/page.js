import './page.scss'
import template from './page.tpl';
import { mapState } from 'vuex';
import tools from '../../modules/tools';
const {getUrlParams} = tools;
const urlParams = getUrlParams();
export default {
    template,
    data() {
        return {
        }
    },
    computed: {
        
    },
    beforeCreate() {
        let redirectUrl = urlParams['redirectUrl'];
        if(redirectUrl){
            location.href = decodeURIComponent(redirectUrl)
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}