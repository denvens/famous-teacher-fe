import './page.scss'
import template from './page.tpl';
import { mapState } from 'vuex';
import tools from '../../../modules/tools';
const {ajax} = tools;
export default {
    template,
    data() {
        return {
            tip: '',
            tipsText: '申请成功,请耐心等待审核',
            scholarshipList: [],
            showTips: false
        }
    },
    computed: {

    },
    mounted() {
        this.tip = 'tip';
        this.getList();
    },
    methods: {
        getList () {
            ajax({
                url: '/user/scholarship-details'
            }).then(res => {
                if (res.success) {
                    this.scholarshipList = res.data.details;
                    this.scholarshipList.forEach(item => {
                        item.beginClassTime = item.beginClassTime.replace(/(-)/g,'.');
                        item.endClassTime = item.endClassTime.replace(/(-)/g,'.');
                    });
                }
            })
        },
        handleClickApply (item) {
            if (item.status == 1) {
                ajax({
                    url: '/user/scholarship-apply-for',
                    data: {
                        levelId: item.levelId
                    }
                }).then(res => {
                    if (res.success) {
                        this.tipsText = '申请成功，请耐心等待审核',
                        this.showTips = true;
                        this.getList();
                    } else {
                        this.tipsText = '申请失败，' + res.data.message,
                        this.showTips = true;
                    }
                })
            }
        }
    }
}