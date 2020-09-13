import './page.scss'
import template from './page.tpl';
export default {
  props: ["tipsText","showTips"],
  template,
  data () {
    return {
      showModal: false
    }
  },
  watch: {
    showTips (newV) {
      if (newV) {
        this.showModal = true;
        let timeId = setTimeout(() => {
          this.showModal = false;
          this.$emit('closeModal', false);
          clearTimeout(timeId);
        },1000)
      }
    }
  }
}