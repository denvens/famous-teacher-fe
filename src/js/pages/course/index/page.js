import './page.scss'
import template from './page.tpl';
import questionLearn from '../../../modules/question';
export default {
    template,
    data() {
        return {
            items: [1,2,3]
        }
    },
    mounted() {
        
    },
    computed: {

    },
    methods: {
        goQuestion(id){
            let list = [
                {
                    question:'请问哪一个是开始的意思',
                    options:[{
                        option: 'now'
                    },{
                        option: 'start'
                    },{
                        option: 'n.阴影；遮蔽；遮光物；（色彩的）浓淡 vt.遮蔽；使阴暗；使渐变； vi.渐变'
                    },{
                        option: 'v.推；按；挤；逼迫；催促 n. 推；奋力'
                    }],
                    answer: 'start',
                    type: 1
                },
                {
                    question: "There is only one now to that.I compared my answers with the teacher's and is I had made a mistake.",
                    src: 'http://cloud.video.taobao.com/play/u/2426460412/p/2/e/6/t/1/50246998675.mp4',
                    answer: ['now','is','and'],
                    answer_options: ['now','is','and','start','who'],
                    type: 2
                }];
            questionLearn.load(list);
            questionLearn.start(0);
            this.$router.push('/course/question');
        }
    }
}