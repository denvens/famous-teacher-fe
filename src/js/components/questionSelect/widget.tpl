<div class="widget-content">
	<div class="video" v-if="questionData.video && questionData.type!=='choice' && questionData.type!=='fill'">
		<video ref="vedio" :src="getFilePath(questionData.video)" controls width="90%" class="video-item" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" controlslist="nodownload"  :poster="questionData.videoimage">您的浏览器不支持播放此视频！</video>
	</div>
	<!-- 单选 -->
	<div class="single-election" v-if="questionData.type=='choice'">
		<div v-for="(choice_item,choice_index) in questionData.addoption">
			<div class="qestion-img">
				<img :src="getFilePath(choice_item.image)" alt="" class="img" v-if="choice_item.image">
				<img src="../../../imgs/qestion-play.png" alt="" :class="[choice_item.image?'qestion-play':'qestion-play-no-img']" v-show="audio_index==choice_index&&choice_item.audio&&play_state == 1" @click="play(choice_item.audio,choice_index)">
				<img src="../../../imgs/qestion-play.png" alt="" :class="[choice_item.image?'qestion-play':'qestion-play-no-img']" v-show="audio_index!==choice_index&&choice_item.audio" @click="play(choice_item.audio,choice_index)">
				<img src="../../../imgs/play1.png" alt="" :class="[choice_item.image?'qestion-play':'qestion-play-no-img']" v-show="audio_index==choice_index&&play_state == 2 && choice_item.audio" @click="play(choice_item.audio,choice_index)">
				<img src="../../../imgs/play2.png" alt="" :class="[choice_item.image?'qestion-play':'qestion-play-no-img']" v-show="audio_index==choice_index&&play_state == 3 && choice_item.audio" @click="play(choice_item.audio,choice_index)">
				<audio :src="choice_item.audio" ref="audios"></audio>
			</div>
			<div class="question">
				<p :class="['question-title',choice_item.description.length < 30 ? 'question-title-center' : '']" v-html="choice_item.description"></p>
			</div>
			<div class="video" v-show="choice_item.video">
				<video ref="vedio" :src="getFilePath(choice_item.video)" controls width="90%" class="video-item" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" controlslist="nodownload" @play="vedioPlay(choice_index)" :poster="choice_item.videoimage">您的浏览器不支持播放此视频！</video>
			</div>
			<div v-if="localStroageItem.length-1>=LearnIndex">
				<button :class="['btn',localStroageItem[LearnIndex].myAnswer[choice_index]==choice_item.options[choice_item.radio].option&&item.option==localStroageItem[LearnIndex].myAnswer[choice_index]?'btn-success':(item.option==localStroageItem[LearnIndex].myAnswer[choice_index])?'btn-err':'', choice_item.options[choice_item.radio].option==item.option?'btn-success': '']" v-for="(item,index) in choice_item.options" :key="index" @click="handleClickBtn(choice_item,item,choice_index)">{{item.option}}</button>
			</div>
			<div v-if="LearnIndex>localStroageItem.length-1&&toAnswer">
				<button :class="['btn',questionData.myAnswer[choice_index]==choice_item.options[choice_item.radio].option&&item.option==questionData.myAnswer[choice_index]?'btn-success':(item.option==questionData.myAnswer[choice_index])?'btn-err':'', choice_item.options[choice_item.radio].option==item.option?'btn-success': '']" v-for="(item,index) in choice_item.options" :key="index" @click="handleClickBtn(choice_item,item,choice_index)">{{item.option}}</button>
			</div>
			<div v-if="LearnIndex>localStroageItem.length-1&&!toAnswer">
				<button :class="['btn',item.success==1 ? 'btn-active' : '']" v-for="(item,index) in choice_item.options" :key="index" @click="handleClickBtn(choice_item,item,choice_index)">{{item.option}}</button>
			</div>
			<div class="answer-analysis" v-if="toAnswer && choice_item.answerkey">
				<p class="analysis">答案解析：</p>
				<p class="answer" v-html="choice_item.answerkey"></p>
			</div>
		</div>
	</div>
	<!-- 填空 -->
	<div class="multiple-election" v-if="questionData.type=='fill'">
		<div class="fill-box">
			<div class="quill-content" :style="{maxHeight:fill_box_height + 'px'}">
				<div class="qestion-img">
					<img :src="getFilePath(questionData.image)" alt="" class="img" v-if="questionData.image">
					<img src="../../../imgs/qestion-play.png" alt="" :class="[questionData.image?'qestion-play':'qestion-play-no-img']" v-show="play_state == 1 && questionData.audio" @click="play">
					<img src="../../../imgs/play1.png" alt="" :class="[questionData.image?'qestion-play':'qestion-play-no-img']" v-show="play_state == 2 && questionData.audio" @click="play">
					<img src="../../../imgs/play2.png" alt="" :class="[questionData.image?'qestion-play':'qestion-play-no-img']" v-show="play_state == 3 && questionData.audio" @click="play">
					<audio :src="questionData.audio" ref="audios"></audio>
				</div>
				<div class="video" v-if="questionData.video">
					<video ref="vedio" :src="getFilePath(questionData.video)" controls width="90%" class="video-item" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" controlslist="nodownload"  :poster="questionData.videoimage">您的浏览器不支持播放此视频！</video>
				</div>
				<template v-if="Array.isArray(questionData.description)" v-for="(item,index) in questionData.description"
					class="question-title-item">
					<p class="quill-content-item" v-if="item.type=='sentence'" v-for="(word,wordIndex) in item.text.split(' ')">
						{{word}}
					</p>
					<p class="selected-item" v-if="item.type=='words' && item.success && !toAnswer && !isSelectedFill">{{item.text}}
						<span class="selected-item-close" @click="handleSelectClose(item,index)">x</span>
					</p>
					<p class="selected-item" v-if="item.type=='words' && toAnswer && isSelectedFill">
						<span>{{item.answer}}</span>
						<span class="right-key" v-if="item.text!==item.answer">{{item.text}}</span>
					</p>
					<i v-if="item.type=='words'&& !item.success && !isSelectedFill" :class="[iActive==index?'i-active':'','to-b-selected']" @click="handleClickFillActive(index)"></i>
					<!-- {{questionData.description||''}} -->
				</template>
				<div v-else>{{questionData.description}}</div>
			</div>
		</div>
		<div class="line"></div>
		<div class="select-box">
			<span v-for="(item,index) in confuse" :key="index" @click="handleClickOption(item,index)" v-if="!isSelectedFill"
			:class="['answer-item', answerArr.length>0 && JSON.stringify(fillArr).match(new RegExp('\\b('+item.trim()+')\\b')) && JSON.stringify(fillArr).indexOf(index)>-1 ? 'answer-item-active':'']">
			{{item}}
			</span>
			<span v-for="(item,index) in confuse" :key="index" @click="handleClickOption(item,index)" v-if="isSelectedFill"
				:class="['answer-item', item.status ? 'answer-item-active' : '']">
				{{item.text ? item.text : item}}
			</span>
			<div class="fill-analysis" v-if="toAnswer && questionData.answerkey">
				<p class="analysis">答案解析：</p>
				<p class="answer" v-html="questionData.answerkey"></p>
			</div>
		</div>
	</div>
	<!-- 讲解 -->
	<div v-if="questionData.type=='explain'">
		<div class="explain" v-html="questionData.questionContent"></div>
	</div>
	<!-- 长文本 -->
	<div class="graphicVideo" v-if="questionData.type=='graphicVideo'">
		<div class="question">
			<p class="graphic-title">{{questionData.lessontitle}}</p>
		</div>
		<div v-for="(item,index) in dialogue">
			<div class="graphic-text" v-if="item.text">
				<img :src="getFilePath(questionData.teacherImg)" alt="" class="graphic-avatar">
				<div v-if="item.text" class="graphic-value">
					<span class="triangle"></span>
					<span class="graphic-value-text">{{item.text}}</span>
				</div>
			</div>
			<img :src="getFilePath(item.image)" alt="" class="graphic-img" v-if="item.image">
			<div class="video" v-show="item.video">
				<video :src="getFilePath(item.video)" ref="vedio" controls width="90%" class="video-item" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" controlslist="nodownload" @play="vedioPlay(index)" :poster="item.videoimage">您的浏览器不支持播放此视频！</video>
			</div>
			<div class="graphic-audio-box" v-if="item.audio">
				<img :src="getFilePath(questionData.teacherImg)" alt="" class="graphic-avatar">
				<div :is="player" :src="item.audio" :index="index" @changePlayType="changePlayType" :playing="item.isPlaying"></div>
				<span class="warning" v-if="warnning">!</span>
			</div>
		</div>
	</div>
	<div class="paragraph">
		<div :is="Paragraph" v-if="questionData.type=='fourSection'" :questionData="questionData" :toAnswer="toAnswer"></div>
	</div>
	<!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips = false"></div>
</div>