import './page.scss'
import template from './page.tpl';
import tools from '../../modules/tools';
import local from '../../modules/localStorage';
import { mapActions } from 'vuex';
const {
  ajax,
  getUploadedFilePath
} = tools;
export default {
  template,
  props: ["showHeader"],
  data() {
    return {
      headerBar: '',
      levelName: '',
      myClassList: [],
      otherClassList: [],
      showMyClass: [],
      show_open: false,   // 是否显示展开全部 
      show_modal: false
    }
  },
  mounted() {
    this.show_open = this.myClassList.length > 3 ? true : false;
    if (this.myClassList.length == 0) {
      this.init()
    }
  },
  watch: {
    showHeader: function (newVal) {
      if (newVal) {
        this.show_modal = true;
      }
    }
  },
  methods: {
    ...mapActions('question', ['getLevelList']),
    init () {
      this.getLevelList().then(res => {
        let levelId = local.getStorage('levelId');
        let list = JSON.parse(JSON.stringify(res.allList));
        this.otherClassList = [];
        this.myClassList = res.powerList;
        this.showMyClass = this.myClassList.filter((item, index) => {
          return index < 3
        })
        this.show_open = this.myClassList.length > 3 ? true : false;
        if (!levelId || levelId && JSON.stringify(this.myClassList).indexOf(levelId) == -1) {
          this.$emit('getId', this.showMyClass[0].id);
          local.setStorage('levelId', this.showMyClass[0].id)
          this.$store.commit('question/setLevelId', this.showMyClass[0].id);
        }
        if (this.myClassList.length == 0) {
          this.$router.push('/');
        }
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < res.powerList.length; j++) {
            if (res.powerList[j].id == list[i].id) {
              list[i] = "";
              break;
            }
          }
        }
        this.otherClassList = list.filter(item => {
          return item != '';
        })
        this.getLevelName()
      })
    },
    handleClickChange() {
      this.show_modal = !this.show_modal;
      if (!this.show_modal) {
        this.$emit('closeShowHeader', false);
      }
      if (this.myClassList.length == 0) {
        this.init()
      }
    },
    handleStartStudy(id) {
      if (local.getStorage('levelId') != id) {
        this.$emit('getId', id);
      }
      local.setStorage('levelId', id)
      this.show_modal = false;
      this.$emit('closeShowHeader', false);
      this.getLevelName();
    },
    handleClickOpen() {
      this.showMyClass = this.myClassList;
      this.show_open = false;
    },
    getLevelName () {
      this.myClassList.forEach(item => {
        if (item.id == local.getStorage('levelId')) {
          this.levelName = item.name;
          this.$store.commit('question/setLevelName', item.name);
        }
      })
    },
    getFilePath(url){
      return getUploadedFilePath(url);
    },
    handleClickBuySite (url) {
      window.location.href = url;
    }
  }
}