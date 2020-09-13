import './page.scss'
import template from './page.tpl';
import { mapState } from 'vuex';
import ClipboardJS from 'clipboard'
export default {
    template,
    data() {
        return {
            tip:'',
            tipsText: '',
            showTips: false,
        }
    },
    computed: {
        ...mapState('app',{
            'nickName': (state) => state.nickName,
            'profileUrl': (state) => state.profileUrl,
            'openId': state => state.openId
        })
    },
    mounted() {
    },
    methods: {
        handleClickTicketNum () {
            this.$router.push('/ticketNum');
        }, 
        handleClickScholarship () {
            this.$router.push('/scholarship');
        },
        handleClickLogistics () {
            this.$router.push('/logistics');
        },
        handleClickBuying () {
            this.$router.push('/buyDetail');
        },
        handleClickCopy () {
            var clipboard = new ClipboardJS('#btn');
            const that = this;
            clipboard.on('success', function(e) {
              e.clearSelection();
              that.tipsText = '复制成功';
              that.showTips = true;
            });
        },
    }
}