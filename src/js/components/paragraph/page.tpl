<div class="paragraph-content">
  <div class="options-box">
    <div v-for="(item,index) in fiveList" class="paragraph-options">
      <div class="head-options-num">{{options[index]}})</div>{{item.selectText}}</div>
  </div>
  <div class="question-box">
    <div v-for="(item,index) in questionData.tenList">
      <div class="question-item"><span class="head-options">{{index+1}}.</span>{{item.text}}</div>
      <div class="option-box">
        <div v-for="(data,i) in fiveList" v-if="localStroageItem.length-1>=LearnIndex" :class="['option',localStroageItem[LearnIndex].myAnswer[index]==item.options[item.selectradio].text&&item.options[i].text==localStroageItem[LearnIndex].myAnswer[index]?'option-active-success':(item.options[i].text==localStroageItem[LearnIndex].myAnswer[index]?'option-active-err':''), item.options[item.selectradio].text==item.options[i].text?'option-active-success': '']">{{item.options[i].text}}</div>
        <div v-if="LearnIndex > localStroageItem.length-1">
          <div v-for="(data,i) in fiveList" v-if="!toAnswer" :class="['option',item.options[i].status && item.options[i].status==1 ? 'option-active' : '']" @click="handleClickOption(index,i)">
            <span>{{options[i]}}</span>
            <div :class="['option-bubble','option-bubble-left'+option_bubble_index]" v-if="item.options[i].status && item.options[i].status==1 && option_bubble_tenIndex == index">{{data.selectText}} <span></span></div>
          </div>
          <div v-for="(data,i) in fiveList" v-if="toAnswer" :class="['option',item.options[i].status==1 ? 'option-active-success' : (item.options[i].status==2 ? 'option-active-err':'')]">{{options[i]}}</div>
        </div>
      </div>      
    </div>
  </div>
  <div class="answer-analysis" v-if="toAnswer" id="answer">
    <p class="analysis">答案解析：</p>
    <p class="answer" v-html="questionData.answerkey"></p>
  </div>
</div>