import './page.scss'
import template from './page.tpl';
import ClipboardJS from 'clipboard'
import { mapState } from 'vuex';
import tools from '../../../modules/tools';
const {ajax} = tools;
export default {
    template,
    data() {
        return {
          add_num: '无',
          tip:'',
          tipsText: '',
          status_text: '',
          logistics_list: [],
          showTips: false,
          shipped: true,
          showAll: false
        }
    },
    computed: {

    },
    mounted() {
      this.tip = 'tip';
      this.getLogisticsInfo()
    },
    methods: {
      handleClickCopy () {
        var clipboard = new ClipboardJS('#btn');
        const that = this;
        clipboard.on('success', function(e) {
          e.clearSelection();
          that.tipsText = '复制成功';
          that.showTips = true;
        });
      },
      getLogisticsInfo () {
        ajax({
          url: '/logistics/info',
          data: {
            levelId: this.$route.params.levelId
          }
        }).then(res => {
          if (res.success) {
            if (res.data[0].code == 471) {
              this.shipped = false;
              this.status_text = '未发货'
            }
            if (res.data[0].data.data) {
              switch (res.data[0].data.state) {
                case 0 :
                  this.status_text = '在途中';
                  break;
                case 1: 
                  this.status_text = '已揽收';
                  break;
                case 2: 
                  this.status_text = '疑难';
                  break;
                case 3: 
                  this.status_text = '已签收';
                  break;
                case 4: 
                  this.status_text = '退签';
                  break;
                case 5: 
                  this.status_text = '派送中';
                  break;
                case 6: 
                  this.status_text = '退回';
                  break;
              }
              this.add_num = res.data[0].data.nu;
              this.shipped = true;
              this.showAll = true;
              var data = res.data[0].data.data;
              // 判断是否是三个连着都是相同的状态如果是，中间的状态要变成  ’点‘
              for (let i = 0;i<data.length;i++) {
                let a = data[i+1] ? data[i+1].status: '';
                if (data[i].status === a) {
                  data[i+1].dian = true;
                }
              }
              this.logistics_list = data;
            }
          }
        })
      }
    }
}