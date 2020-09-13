import template from './clear.tpl';
import { mapState } from 'vuex';
export default {
    template,
    data() {
        return {
        }
    },
    computed: {
        
    },
    mounted() {
      localStorage.clear()
    },
    methods: {
        
    }
}