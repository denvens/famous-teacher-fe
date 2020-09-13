import './page.scss'
import template from './page.tpl';
import { mapState, mapActions } from 'vuex';
export default {
    template,
    data() {
        return {
        }
    },
    computed: {
        ...mapState('question', {
            levelList: state => state.levelList
        })
    },
    mounted() {
        this.getLevelList().then(res => {
            if (res.powerList && res.powerList.length > 0) {
                this.$router.replace('/main');
            }
        })
    },
    methods: {
        ...mapActions('question', ['getLevelList']),
        handleClickBuySite (url) {
            if (url) {
                alert(url)
                window.location.href = url;
            }
        }
    }
}