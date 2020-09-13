<div class="question-content">
    <div class="lesson-header">
        <div>lesson {{lessonOrder}}</div>
        <img src="../../../../imgs/question-home.png" alt="" @click="handleGoMain">
    </div>
    <div class="progress" ref="progress"></div>
    <div :is="renderView" :questionData="getQuestion" :key="'question'+questionIndex" :double_speed="double_speed" :toAnswer="toAnswer" @hasAnswer="getHasAnswer" @hasVideo="getHasVideo" @isGraphicVideo="getIsGraphicVideo" @graphicVideoData="getGraphicVideoData"></div>
    <div class="next-prev-btn">
        <div @click="prevQuestion" :class="[not_prev?'prev-btn':'','prev-btn-active']"><img src="../../../../imgs/learn_front.png" alt=""/>上页</div>
        <div class="next-btn" v-if="has_video" @click="handleClickSpeed">
            <img src="../../../../imgs/beisu1.png" alt="" v-show="double_speed == 1">
            <img src="../../../../imgs/beisu15.png" alt="" v-show="double_speed == 1.5">
            <img src="../../../../imgs/beisu15@2.png" alt="" v-show="double_speed == 2">
            <span>倍速</span>
        </div>
        <div class="next-btn" v-show="this.hasAnswer" @click="handleClickHasAnswer"><img src="../../../../imgs/learn_ans.png" alt="">答案</div>
        <div @click="nextQuestion" class="next-btn"><img src="../../../../imgs/learn_next.png" alt=""/>{{next_text}}</div>
    </div>
    <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>