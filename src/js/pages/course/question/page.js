import './page.scss'
import template from './page.tpl';
import questionLearn from '../../../modules/question';
import { mapGetters, mapState } from 'vuex';
import local from '../../../modules/localStorage'
import tools from '../../../modules/tools';
const {
	ajax, getUrlParams, frontendLog
} = tools;
const urlParams = getUrlParams();
export default {
	template,
	data() {
		return {
			tip: '',
			nowTime: 0,
			stime: null,
			timeId: null,     //  下一页的倒计时
			alreadyOnceTime: '',   // 之前的时间
			firstUseTime: '',   // 第一次时间
			remainTime: '',   // 对话类型的剩余时间
			renderView: '',
			tipsText: '',
			localStorageItem: '',
			lessonOrder: 0,
			questionIndex: 1,
			next_text: '下页',
			learnList: questionLearn.learnList,
			beisu: [1, 1.5, 2],
			localAnswer: null,   // 本地答案的key
			parseLocalAnswerList: null,     // 本地答案的值  JSON.parse  值
			double_speed: 1,
			graphicVideoData: null,
			not_prev: false,
			showTips: false,
			toAnswer: false,
			hasAnswer: false,    // 是否有答案
			hasAir: false,     // 是否已完成答题
			has_video: false,
			is_graphicVideo: false, //  是否是对话题
			is_init: false    //  是否是刚进入页面
		}
	},
	mounted() {
		this.init();
		this.is_init = true;
		if (!this.is_graphicVideo) {
			this.getFirstTime();
		}
	},
	computed: {
		...mapState('app', {
			'nickName': (state) => state.nickName,
			'openId': (state) => state.openId,
		}),
		...mapGetters('question', ['getQuestion', "getIsPreved", "getLevelId", "getLessonId", "getLessonOrder"]),
	},
	methods: {
		init() {
			this.tip = 'tip';
			this.lessonOrder = this.getLessonOrder;
			this.stime = new Date().getTime();
			this.localAnswer = this.getLevelId + '-' + this.getLessonId;
			this.parseLocalAnswerList = JSON.parse(local.getStorage(this.localAnswer));
			this.questionIndex = this.parseLocalAnswerList ? this.parseLocalAnswerList.length : 0;
			this.$nextTick(() => {
				this.$refs.progress.style.width = ((parseInt(this.questionIndex) / parseInt(this.learnList.length)) * 100) + 'vw';
			})
			if (this.questionIndex == this.learnList.length - 1 || this.questionIndex == this.learnList.length) {
				this.next_text = '完成';
			}
			this.not_prev = questionLearn.index == 0 ? true : false;
			this.renderView = 'questionSelect';
			// 进入页面的时间
			this.timeIndexId = setInterval(() => {
				this.nowTime++;
				this.setTime(60);
			}, 60000)
			// 如果当前页面已经学过有答案了就显示答案
			if (this.parseLocalAnswerList[questionLearn.index]) {
				this.toAnswer = true;
			}
		},
		nextQuestion() {
			let time = Math.ceil((new Date().getTime() - this.stime) / 1000 + this.alreadyOnceTime);
			if (this.is_graphicVideo && this.firstUseTime == 0 && time < this.getQuestion.stoptime) return;
			this.is_init = false;
			this.setFrontendLog('click next');   // 日志
			this.hangInTheAir();
			this.toAnswer = false;
			if (this.hasAir) return;
			if (this.getQuestion.type == 'explain' || this.getQuestion.type == 'graphicVideo') {
				let answerArr = this.parseLocalAnswerList;
				if (this.parseLocalAnswerList.length - 1 < questionLearn.index) {
					answerArr.push({});
				}
				local.setStorage(this.localAnswer, JSON.stringify(answerArr));
			}
			this.not_prev = false;
			if (this.next_text == '完成' && !urlParams['lessonkey']) {
				this.setLastTime(1).then(res => {
					this.$store.commit('question/setQuestionTime', time);
					ajax({
						url: '/event/lesson-finish-event',
						withCredentials: true,
						data: {
							subjectId: 1000000,
							levelId: this.getLevelId,
							lessonId: this.getLessonId,
							eventType: 'convent',
							order: this.lessonOrder,
							firstUseTime: time
						}
					}).then(res => {
						this.$router.replace('/course/success');
						return;
					}).catch(err => {
						console.log(err);
					})
				})
			}
			if (this.next_text == '完成' && urlParams['lessonkey']) {
				this.$router.replace('/course/success');
			}
			if (questionLearn.index < this.parseLocalAnswerList.length - 1) {
				this.$nextTick(() => {
					this.toAnswer = true;
				})
			}
			this.questionIndex++;
			this.$refs.progress.style.width = ((this.questionIndex / this.learnList.length) * 100) + 'vw';
			if (this.questionIndex == this.learnList.length - 1) {
				this.next_text = '完成';
			}
			if (this.toAnswer) {
			} else {
				this.setStorageItem();
			}
			questionLearn.emit('nextQuestion')
			this.renderView = 'questionSelect';
		},
		prevQuestion() {
			this.toAnswer = false;
			this.is_init = false;
			if (this.getIsPreved || this.questionIndex == 0) {
				return;
			}
			this.questionIndex--;
			this.$refs.progress.style.width = ((this.questionIndex / this.learnList.length) * 100) + 'vw';
			this.not_prev = this.questionIndex == 0 ? true : false;
			if (this.questionIndex < this.learnList.length) {
				this.next_text = '下页';
				this.$nextTick(() => {
					this.toAnswer = true;
				})
			}
			questionLearn.emit('prevQuestion')
			this.renderView = 'questionSelect';
			if (this.timeId) {
				clearInterval(this.timeId);
				this.timeId = null;
				this.is_graphicVideo = false;
			}
		},
		handleGoMain() {
			this.$router.replace('/main');
		},
		// 日志
		setFrontendLog(_type) {
			frontendLog({
				openId: this.openId,
				nickName: this.nickName,
				levelId: this.getLevelId,
				lessonId: this.getLessonId,
				order: this.getLessonOrder,
				qestionIndex: questionLearn.index,
				type: _type || 'get into'
			})
		},
		getHasAnswer(data) {
			this.hasAnswer = data;
		},
		handleClickHasAnswer() {
			this.hangInTheAir()
			if (this.hasAir) return;
			this.setStorageItem();
			this.toAnswer = true;
		},
		setStorageItem() {
			let answerArr = this.parseLocalAnswerList;
			let obj = null;
			if (this.parseLocalAnswerList.length - 1 < questionLearn.index) {
				if (this.getQuestion.type == 'explain' || this.getQuestion.type == 'graphicVideo') {
					obj = {};
				} else {
					obj = {
						myAnswer: this.getQuestion.myAnswer,
					}
				}
				answerArr.push(obj || '{}');
			}
			local.setStorage(this.localAnswer, JSON.stringify(answerArr));
		},
		setTime(time, over) {
			return new Promise((resolve,resject) => {
				ajax({
					url: '/event/online-time-event',
					withCredentials: true,
					data: {
						subjectId: 1000000,
						levelId: this.getLevelId,
						lessonId: this.getLessonId,
						onceTime: time,
						order: this.lessonOrder,
						onceTimeIsOver: over || 0
					}
				}).then(res => {
					if (res.success) {
						console.log(res);
						resolve()
					}
				}).catch(err => {
					console.log(err);
					resject()
				})
			})
		},
		setLastTime(over) {
				return new Promise((resolve,resject) => {
					let time = new Date().getTime();
					let c = Math.ceil((time - this.stime) / 1000 - (this.nowTime * 60));
					if (this.timeIndexId) {    // 清除计算时间定时器
						clearInterval(this.timeIndexId);
						this.timeIndexId = null;
					}
					if (this.timeId) {
						clearInterval(this.timeId);
						this.timeId = null;
					}
					this.setTime(c, over)
					resolve()
				})
		},
		getFirstTime() {
			return new Promise ((reslove,resject) => {
				ajax({
					url: '/event/get-once-time',
					data: {
						subjectId: 1000000,
						levelId: this.getLevelId,
						lessonId: this.getLessonId,
					}
				}).then(res => {
					if (res.success) {
						this.alreadyOnceTime = res.data.alreadyOnceTime;
						this.firstUseTime = res.data.firstUseTime;
						if (this.graphicVideoData) {
							this.isGraphicVideo();
						}
						reslove()
					}
				})
			})
		},
		isGraphicVideo (data) {
			if (this.is_graphicVideo && this.firstUseTime == 0 && this.alreadyOnceTime < this.graphicVideoData.stoptime) {
				// 对话需要限制时长15分钟
				this.lastTime = new Date().getTime();
				let second = (this.lastTime - this.stime) / 1000;
				let time = Math.round(this.graphicVideoData.stoptime - (second + this.alreadyOnceTime));
				if (time > 2) {
					this.timeId = setInterval(() => {
						time--;
						let min = parseInt(time / 60);
						let miao = parseInt(time % 60);
						let text = min > 0 ? min + '分' + miao + '秒' : miao + '秒';
						this.next_text = text;
						if (time < 1 && this.timeId) {
							if (this.questionIndex == this.learnList.length - 1) {
								this.next_text = '完成';
							} else {
								this.next_text = '下页';
							}
							clearInterval(this.timeId);
							this.timeId = null;
							this.is_graphicVideo = false;
						}
					}, 1000)
				}
			} else {
				this.is_graphicVideo = false;
			}
		},
		hangInTheAir() {
			this.hasAir = false;
			if (this.parseLocalAnswerList.length == 0 || this.parseLocalAnswerList.length - 1 < questionLearn.index) {
				if (this.getQuestion.type == 'choice' && this.getQuestion.myAnswer.length !== this.getQuestion.addoption.length) {
					this.tipsText = '请先完成作答';
					this.showTips = true;
					this.hasAir = true;
				}
				if (this.getQuestion.type == 'fill' && (this.getQuestion.myAnswer.filter(item => item != '').length !== this.getQuestion.knockout.length)) {
					this.tipsText = '请先完成作答';
					this.showTips = true;
					this.hasAir = true;
				}
				if (this.getQuestion.type == "fourSection" && (this.getQuestion.myAnswer.length !== this.getQuestion.tenList.length)) {
					this.tipsText = '请先完成作答';
					this.showTips = true;
					this.hasAir = true;
				}
			}
		},
		getHasVideo(data) {
			this.has_video = data;
		},
		handleClickSpeed() {
			for (let i = 0; i < this.beisu.length; i++) {
				if (this.beisu[i] == this.double_speed) {
					if (i == this.beisu.length - 1) {
						this.double_speed = this.beisu[0];
					} else {
						this.double_speed = this.beisu[i + 1];
					}
					return;
				}
			}
		},
		getIsGraphicVideo(data) {
			this.is_graphicVideo = data;
			if (!this.is_init) {
				this.stime = new Date().getTime();
				this.getFirstTime()
			}
		},
		getGraphicVideoData (data) {
			this.graphicVideoData = data;
		}
	},
	destroyed() {
		questionLearn.removeNextEmitter();
		questionLearn.removeEndEmitter();
		if (this.next_text != '完成') {
			this.setLastTime();
		}
		if (this.timeId) {
			clearInterval(this.timeId);
			this.timeId = null;
		}
	}
}