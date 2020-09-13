import './page.scss'
import template from './page.tpl';
import tools from '../../../modules/tools';
const {ajax} = tools;

export default {
    template,
    data() {
        return {
          tip: '',
          tipsText: '',
          wuliuArr: [],
          noWuliu: false,
          showTips: false,
        }
    },
    computed: {

    },
    mounted() {
      this.tip = 'tip';
      this.getLogisticsList();
    },
    methods: {
      handleClickDetail (item) {
        if (!item.status || item.status=='未发货') {
          this.tipsText = item.logistics;
          this.showTips = true;
          return;
        }
        this.$router.push({ path: `/expressDetail/${item.levelId}`});
      },
      getLogisticsList () {
        ajax({
          url: '/logistics/logistics-List',
        }).then(res => {
          if (res.success) {
            res.data.forEach(item => {
              var status_text = '';
              if (item.data) {
                if (item.data[0].data) {
                  switch (item.data[0].data.state) {
                    case 0 :
                      status_text = '在途中';
                      break;
                    case 1: 
                      status_text = '已揽收';
                      break;
                    case 2: 
                      status_text = '疑难';
                      break;
                    case 3: 
                      status_text = '已签收';
                      break;
                    case 4: 
                      status_text = '退签';
                      break;
                    case 5: 
                      status_text = '派送中';
                      break;
                    case 6: 
                      status_text = '退回';
                      break;
                  }
                } else {
                  status_text = '未发货'
                }
              }
              this.wuliuArr.push({
                levelName: item.levelName,
                levelId: item.levelId,
                status: status_text,
                logistics: item.data ? (item.data[0].data ? (item.data[0].data.data ? item.data[0].data.data[0].context : item.data[0].data.message) : '暂未收到物流信息') : '该课程暂无配套纸质材料',
                time: item.data && item.data[0].data&&item.data[0].data.data ? item.data[0].data.data[0].time : '',
              })
              this.noWuliu = this.wuliuArr.length == 0 ? true: false;
            });
          }
        })
      }
    }
}