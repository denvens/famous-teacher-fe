import './page.scss'
import template from './page.tpl';
import { mapState, mapGetters } from 'vuex';
import questionLearn from '../../modules/question';
import local from '../../modules/localStorage';
export default {
  props: ['questionData', "toAnswer"],
  template,
  data() {
    return {
      fiveList: [],
      option_bubble_id: null,
      option_bubble_num: 0,
      option_bubble_index: 0,
      option_bubble_tenIndex: 0,
      localStroageItem: '',
      LearnIndex: questionLearn.index,
      options: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    }
  },
  watch: {
    toAnswer: function (newV) {
      if (newV) {
        this.questionData.tenList.forEach(item => {
          item.options.forEach(options_item => {
            options_item.status = 3;
            item.options[item.selectradio].status = 1;
            if (item.myAnswer == item.options[item.selectradio].text) {
              item.options[item.selectradio].status = 1
            } else {
              if (JSON.stringify(options_item).indexOf(item.myAnswer) > -1) {
                options_item.status = 2;
              }
            }
          })
        })
        this.$nextTick(() => {
          let answer = document.getElementById('answer');
          console.log(answer);
          
          if (answer) {
            answer.scrollIntoView()
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters('question', ["getLevelId", "getLessonId"]),
  },
  mounted() {
    this.fiveList = this.questionData.fiveList;
    this.localStroageItem = JSON.parse(local.getStorage(this.getLevelId + '-' + this.getLessonId));
  },
  methods: {
    init (index) {
      this.questionData.tenList[index].options.forEach((element,eleIndex) => {
        if (element.text) {
          element.status = 3;
        } else {
          this.questionData.tenList[index].options.splice(eleIndex,1,{
            text: element,
            status: 3
          })
        }
      })
    },
    handleClickOption (index,i) {
      this.init(index);
      this.questionData.tenList[index].options.splice(i,1,{
        text: this.questionData.tenList[index].options[i].text,
        status: 1
      })
      this.questionData.tenList[index].myAnswer = this.questionData.tenList[index].options[i].text;
      this.questionData.myAnswer[index] = this.questionData.tenList[index].options[i].text;
      if (i !== this.option_bubble_num && this.option_bubble_id) {
        clearTimeout(this.option_bubble_id);
        this.option_bubble_id = null;
      }
      this.option_bubble_num = i;
      this.option_bubble_index = ((i%5)+1) % 6;
      this.option_bubble_tenIndex = index;
      this.option_bubble_id = setTimeout(() => {
        this.option_bubble_tenIndex = null;
        if (this.option_bubble_id) {
          clearTimeout(this.option_bubble_id);
          this.option_bubble_id = null;
        }
      },1000)
    }
  }
}