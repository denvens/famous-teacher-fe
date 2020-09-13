import ee from 'event-emitter';
import local from './localStorage'
import tools from './tools';
const {getUploadedFilePath, getUrlParams} = tools;
const urlParams = getUrlParams();
class QuestionLearn {
    constructor(){
        this.index = 0;
        this.learnList = [];
    }
    load(list,index){
        if(index){
            this.index = index;
        }
        this.learnList = list;
    }
    start(index){
        let $this = this;
        this.index = parseInt(index);
        let store = require('../store').default;
        let levelId = local.getStorage('levelId');
        let lessonId = urlParams['id'] ? urlParams['id'] : $this.learnList[$this.index].lessonId;
        let questionAnswer = JSON.parse(local.getStorage(levelId+'-'+lessonId));
        if (questionAnswer) {
            $this.index = questionAnswer.length == $this.learnList.length ? questionAnswer.length-1 : questionAnswer.length;
            store.commit('question/setQuestion',$this.learnList[$this.index]);
        } else {
        }
        store.commit('question/setQuestion',$this.learnList[$this.index]);
        // 监听下一题
        this.on('nextQuestion',this.nextQuestion);
        this.on('prevQuestion',this.prevQuestion);
        // 监听题目做完时的逻辑
        this.on('finished',this.finish);
        this.on('Preved',this.Prev);
        if(this.learnList[this.index+1]){
            loadImage(this.learnList[this.index+1])
        }
        if(this.learnList[this.index+2]){
            loadImage(this.learnList[this.index+2])
        }
    }
    nextQuestion(){
        let store = require('../store').default;
        if(this.learnList.length - 1 === this.index){
            this.emit('finished');
            return;
        }
        this.index ++;
        store.commit('question/setQuestion',this.learnList[this.index]);
        console.log('next question!');
        if(this.learnList[this.index+2]){
            loadImage(this.learnList[this.index+2])
        }
    }
    prevQuestion(){
        let store = require('../store').default;
        if(this.index == 0){
            this.emit('Preved');
            return;
        }
        this.index --;
        store.commit('question/setQuestion',this.learnList[this.index]);
        console.log('prev question!');
    }
    finish(){
        let store = require('../store').default;
        store.commit('question/setIsPreved',false);
        console.log('finished');
    }
    Prev(){
        let store = require('../store').default;
        store.commit('question/setIsPreved',true);
    }
    // 移除下一题和上一题的监听
    removeNextEmitter(){
        if(this.nextQuestion){
            this.off('nextQuestion',this.nextQuestion);
        } 
        if (this.prevQuestion) {
            this.off('prevQuestion',this.prevQuestion);
        }
    }
    // 移除做完题目的监听
    removeEndEmitter(){
        if(this.finish){
            this.off('finished',this.finish);
        }
    }
}

// 预加载图片资源
function loadImage(data){
    if(typeof data == 'object' && !Array.isArray(data)){
        for(let key in data){
            loadImage(data[key])
        }
    }else if(typeof data == 'object' && Array.isArray(data)){
        let len = data.length;
        for(let i=0;i<len;i++){
            loadImage(data[i])
        }
    }else if(typeof data == 'string'){
        if(/(\.png)$|(\.gif)$|(\.jpg)$|(\.jpeg)$/.test(data)){
            if(data.indexOf(',')>-1){
                let list = data.split(',');
                loadImage(list)
            }else{
                let img = new Image();
                img.src = getUploadedFilePath(data);
            }
        }
    }
}
ee(QuestionLearn.prototype);

const questionLearn = new QuestionLearn;
export default questionLearn;