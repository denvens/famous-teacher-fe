// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return ('0' + mimute).slice(-2) + '"' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}

var questionAudio = {};
var effects = {

}
var effectAudio = {};
// 预加载本地音频（本地点击音效）
function preLoadEffect(){
  for(let key in effects){
    let audio = new Audio();
    audio.src = effects[key];
    audio.load();
    effectAudio[key] = audio;
  }
}
// 播放本地音频
function playEffect(key){
  if(effectAudio[key]){
    effectAudio[key].play();
  }
}
// 预加载题目音频
function loadQuestionAudio(list){
  list.forEach(item=>{
    if(!questionAudio[item]){
      let audio = new Audio();
      audio.src = item;
      audio.load();
      questionAudio[item] = audio;
    }
  })
}
// 播放题目音频
function playQuestionAudio(url){
  for(let key in questionAudio){
    questionAudio[key].pause();
  }
  questionAudio[url].play();
}
// 暂停题目音频
function pauseQuestionAudio(url){
  if (url) {
    questionAudio[url].pause();
  }
}



export default {
  realFormatSecond,
  loadQuestionAudio,
  playQuestionAudio,
  pauseQuestionAudio,
  preLoadEffect,
  playEffect
}