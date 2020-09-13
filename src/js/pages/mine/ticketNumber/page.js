import './page.scss'
import template from './page.tpl';
import { mapState } from 'vuex';
import ClipboardJS from 'clipboard'
import tools from '../../../modules/tools';
const {ajax} = tools;
export default {
    template,
    data() {
        return {
          tip:'',
          tipsText: '',
          cet: 1,
          id: null,
          num: null,
          fill_text: '大学英语四级考试（CET-4）',
          ticketList: [],
          hasTicket: false,     // 没有数据时显示添加
          is_select: false,
          is_save: false,
          fill_err: false,
          is_fill: false,      // 添加准考证显示
          show_num: false,    // 显示已经添加的我的准考证
          showTips: false,
          is_edit: false,
        }
    },
    computed: {
      ...mapState('app',{
        'openId': state => state.openId
      })
    },
    mounted() {
      this.tip = 'tip';
      this.getNumList();
    },
    methods: {
      getNumList () {
        ajax({
          url: '/certificate/list'
        }).then(res => {
          if (res.success) {
            if (res.data.certificateList.length == 0) {
              this.hasTicket = true;
            } else {
              this.show_num = true;
              this.hasTicket = false;
              this.ticketList = res.data.certificateList;
              this.num = res.data.certificateList[0].number;
              this.cet = res.data.certificateList[0].classify;
              this.fill_text = res.data.certificateList[0].classify == 1 ? '大学英语四级考试（CET-4）' : '大学英语六级考试（CET-6）';
              this.id = res.data.certificateList[0].id;
            }
          }
        })
      },
      handleClickSelect () {
        this.is_select = !this.is_select;
      },
      handleClickCloseModal () {
        this.is_select = !this.is_select;
        if (this.cet == 1) {
          this.fill_text = '大学英语四级考试（CET-4）'
        } else {
          this.fill_text = '大学英语六级考试（CET-6）'
        }
      },
      handleClickReady () {
        this.is_select = !this.is_select;
        if (this.cet == 1) {
          this.fill_text = '大学英语四级考试（CET-4）'
        } else {
          this.fill_text = '大学英语六级考试（CET-6）'
        }
      },
      handleChange (e) {
        this.cet = e.target.value;
      },
      handleChangeInput () {
        this.is_save = true;
      },
      handleClickSave () {
        if (this.num && this.num.length != 15) {
          this.fill_err = true;
          return;
        } else {
          this.fill_err = false;
        }
        if (this.is_edit) {
          ajax({
            url: '/certificate/edit',
            data: {
              id: this.id,
              classify: Number(this.cet),
              number: this.num
            }
          }).then(res => {
            if (res.success) {
              this.getNumList();
              this.tipsText = '修改成功';
              this.showTips = true;
              this.show_num = true;
              this.is_fill = false;
            }
          }).catch(err => {
            this.tipsText = '修改失败，请稍后再试';
            this.showTips = true;
            this.show_num = true;
            this.is_fill = false;
            this.hasTicket = false;
          })
        } else {
          ajax({
            url: '/certificate/create',
            data: {
              classify: this.cet,
              number: this.num
            }
          }).then(res => {
            if (res.success) {
              this.getNumList();
              this.tipsText = '保存成功';
              this.showTips = true;
              this.show_num = true;
              this.is_fill = false;
            }
          }).catch(err => {
            this.tipsText = '保存失败，请稍后再试';
            this.showTips = true;
            this.show_num = false;
            this.is_fill = false;
            this.hasTicket = true;
          })
        }
      },
      handleClickEdit () {
        this.show_num = false;
        this.is_fill = true;
        this.is_edit = true;
        this.is_save = true;
        this.fill_err = false;
      },
      handleClickAdd () {
        this.show_num = false;
        this.is_fill = true;
        this.hasTicket = false;
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
      handleClose () {
        if (this.ticketList.length > 0) {
          this.show_num = true;
          this.is_fill = false;
          this.hasTicket = false;
        } else {
          this.show_num = false;
          this.is_fill = false;
          this.hasTicket = true;
        }
      }
    }
}