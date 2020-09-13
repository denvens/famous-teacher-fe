import './widget.scss'
import template from './widget.tpl';
import tools from '../../modules/tools';
import local from '../../modules/localStorage';
const { getUploadedFilePath, frontendLog } = tools;
import { mapGetters } from 'vuex';
import questionLearn from '../../modules/question';
import audio from '../../modules/audio';
// import videoPlayer from 'vue-video-player';
const { playQuestionAudio, pauseQuestionAudio } = audio;

export default {
	props: ['questionData', "toAnswer","double_speed"],
	template,
	data() {
		return {
			LearnIndex: questionLearn.index,
			fill_box_height: (window.screen.height -100 -80) / 4 * 3,     // 填空的高度
			fillNum: 0,    //  填空的空数
			timeIndexId: null,
			content: '',    //  填空题目
			tipsText: '还没有选择哦',  // 提示信息
			player: '',
			Paragraph: '',    // 15选10组件
			fillSelectIndex: 0,   // 填空选择的index
			play_state: 1,      //  1，2，3代表三张播放图
			currentTime: 0,
			intervalId: null,    // 定时器id
			currentTimeId: null,   // 获取剩余时长的定时器ID
			iActive: 0,   // 填空第一个颜色问题
			tip: '',
			audioCurrentTime: [],    // 所选择的音频播放剩余的时长
			url: '',    //   选择题的URL
			audio_index: 0,     //  选择题多个音频时的index
			vedio_index: 0,    //  多视频的index
			localStroageItem: '',
			showAnswerArr: [],   // 填空题用于展示的答案
			confuse: [],
			fillArr: [],    // 选择的数组，用于防止多次选择一个单词
			answerArr: [],   //  选择的答案数组
			spareFillArr: [],   // 剩余填空的数组
			dialogue: [],
			vedioSrc: [],    // 被点击过的vedio数组
			warnning: false,
			is_play: false,
			showTips: false,
			isClickFillOption: false,   // 连点
			isSelectedFill: false,
			showSpeedBox: false,
			has_video: false, // 是否有视频
		}
	},
	mounted() {		
		this.$emit('hasVideo', false);   // 默认没有视频
		this.handleHasVideo(this.questionData);
		this.localStroageItem = JSON.parse(local.getStorage(this.getLevelId + '-' + this.getLessonId));
		try {
			this.init();
		} catch (e) {
			frontendLog({
				openId: this.$store.state.app.openId,
				questionRenderError: e,
				type: 'get into'
			})
		}
		this.player = 'player';
		this.tip = 'tip';
		this.Paragraph = 'Paragraph';
		frontendLog({
			openId: this.$store.state.app.openId,
			questionRender: true,
			nickName: this.$store.state.app.nickName,
			levelId: this.getLevelId,
			lessonId: this.getLessonId,
			order: this.getLessonOrder,
			qestionIndex: this.LearnIndex,
			type: 'get into'
		})
	},
	destroyed() {
		this.url ? pauseQuestionAudio(this.url) : '';
		if (this.timeIndexId) {
			clearInterval(this.timeIndexId);
			this.timeIndexId = null;
		}
	},
	computed: {
		...mapGetters('question', ["getLevelId", "getLessonId","getLessonOrder"]),
	},
	watch: {
		toAnswer: function (newV) {
			if (newV) {
				this.isSelectedFill = true;
				// 选择对答案时填空选项的颜色显示
				if (this.questionData.type == 'fill') {
					this.questionData.description.forEach(fillItem => {
						if (fillItem.type == 'words') {
							// 如果选中的答案和本身的答案是相同的，证明选对了，填空选项标记为1，否则标记为2
							if (fillItem.text == fillItem.answer) {
								let answerIndex = this.confuse.indexOf(fillItem.text);
								this.confuse.splice(answerIndex, 1, {
									text: fillItem.text,
									status: 1
								})
							} else {
								let answerIndex = this.confuse.indexOf(fillItem.text);
								this.confuse.splice(answerIndex, 1, {
									text: fillItem.text,
									status: 2
								})
							}
						}
					})
				}
			}
		},
		double_speed: function (newV) {
			this.$refs.vedio[this.vedio_index].playbackRate = newV;
		}
	},
	methods: {
		init() {
			this.isLoading = true;
			if (this.questionData.type == 'choice' || this.questionData.type == 'fill' || this.questionData.type == 'fourSection') {
				this.$emit('hasAnswer', true)
			}
			if (this.questionData.type == 'graphicVideo') {
				this.dialogue = this.questionData.dialogue || [];
				this.$emit('hasAnswer', false);
				this.$emit('graphicVideoData',this.questionData);
				this.$emit('isGraphicVideo',true);
			}
			if (this.questionData.type == 'explain') {
				this.$emit('hasAnswer', false)
			}
			if (this.questionData.type == 'fill') {
				this.content = this.questionData.originDesc || "[]";
				this.confuse = this.resetConfuseList(this.questionData.knockout.concat(this.questionData.confuse));    //  混淆词和填空词混合一起
				// 获取剩余填空的数组，如果已经获取过就不再获取，获取剩余填空的数组主要是需要填空位置的索引值
				if (this.spareFillArr.filter(item => item != '').length == 0) {
					let arr = [];
					this.questionData.description.forEach((descitem, index) => {
						if (descitem.type == 'words') {
							arr.push(index)
						}
					})
					this.spareFillArr = arr;
					this.iActive = this.spareFillArr.filter(item => item != '')[0];
				}
				// 如果当前的题目的索引小于存入答案的索引，那么当前题目是做过的
				if (this.localStroageItem.length - 1 >= this.LearnIndex) {
					this.isSelectedFill = true;
					this.answerArr = this.questionData.knockout;
					this.localStroageItem[this.LearnIndex].myAnswer.forEach((item, index) => {
						// 只有是挖空词并且没有answer字段的时候才会重新赋值，否则不赋值，避免重复
						if (this.questionData.description[index].type == 'words' && !this.questionData.description[index].answer) {
							this.questionData.description[index] = {
								type: this.questionData.description[index].type,
								answer: this.questionData.description[index].text,    //  原本的正确答案
								text: item    //  选中的填空词
							};
						}
					})
					this.localStroageItem[this.LearnIndex].myAnswer.forEach((item, index) => {
						this.fillArr.push({
							item: item.trim(),
							index
						})
					})
				} else {
					if (JSON.stringify(this.questionData.description).indexOf('answer') > -1) {
						this.answerArr = this.questionData.knockout;
						this.questionData.description.forEach(item => {
							if (item.type == 'words') {
								this.confuse.forEach((outItem,outIndex) => {
									if (outItem.trim() == item.text.trim()) {
										this.fillArr.push({
											item: item.text.trim(),
											index: outIndex
										})
									}
								})
							}
						})
					}
				}
			}
		},
		handleClickBtn(data, item, choice_index) {
			// 没有选择不让进行下一题
			if (this.isClickFillOption || this.toAnswer) {
				return;
			}
			this.isClickFillOption = true;
			let options = data.options;
			options.forEach(option_item => {
				this.$set(option_item, 'success', 2)
				if (option_item.option.trim() == item.option.trim()) {
					this.$set(option_item, 'success', 1);   // 对的
				} else {
					this.$set(option_item, 'success', 2);   // 错的
				}
			})
			this.questionData.myAnswer[choice_index] = item.option;
			// 判断如果题目中的自选答案的数量==题目里选择题的数量且自选答案中不能有空的才可以存本地答案
			if (this.questionData.myAnswer.length == this.questionData.addoption.length && this.localStroageItem.length <= this.LearnIndex) {
				for (let i = 0; i < this.questionData.myAnswer.length; i++) {
					if (!this.questionData.myAnswer[i]) {
						this.isClickFillOption = false;
						return;
					}
				}
			}
			this.isClickFillOption = false;
		},
		handleClickOption(item, index) {
			if (this.isClickFillOption) {
				return;
			}
			if (this.answerArr.length > 0 && (this.answerArr.filter(item => item != '').length == this.questionData.knockout.length)) {
				return;
			};
			// 如果已经选过的单词不可以再选,判断如果选中的词和选中词的索引都不存在才可以进行，如果存在说明已经是选择过得单词，不可重复选择
			for (let i = 0; i < this.fillArr.length; i++) {
				let fill_item = this.fillArr[i]
				if (fill_item.item) {
					if (fill_item.item.match(new RegExp('\\b(' + item.trim() + ')\\b')) && fill_item.index.indexOf(index) > -1) {
						return;
					}
				}
			}
			this.isClickFillOption = true;
			this.fillArr.push({
				index: index + '',
				item: item.trim()
			});
			this.answerArr.push(item)
			// 剩余填空的数组的第一个就是下一个需要填空的位置
			let fill_item;
			if (this.spareFillArr.filter(item => item !== '')[0] == this.iActive) {
				fill_item = this.spareFillArr.filter(item => item !== '')[0];
			} else {
				fill_item = this.iActive;
			}
			// 选择后标记
			this.questionData.description.splice(fill_item, 1, {
				type: this.questionData.description[fill_item].type,
				answer: this.questionData.description[fill_item].text,
				text: item,
				success: 1
			});
			this.questionData.myAnswer[fill_item] = item;
			// 选完后把对应剩余填空的位置设置为空，那么下一个填空的位置就是   spareFillArr 数组中第一个有有效元素的值
			this.spareFillArr.forEach((item, index) => {
				if (item == fill_item) {
					this.spareFillArr.splice(index, 1, '');
				}
			})
			this.iActive = this.spareFillArr.filter(item => item != '')[0];    // 蓝色
			this.fillSelectIndex++;
			this.isClickFillOption = false;
		},
		play(url, index) {
			if (index !== this.audio_index) {
				this.is_play = false;
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null;
				}
			}
			this.audio_index = index;
			this.url = url;
			this.$refs.audios[index].disablePictureInPicture= true; 
			if (this.is_play) {
				pauseQuestionAudio(url);
				if (this.currentTimeId) {
					clearInterval(this.currentTimeId);
					this.currentTimeId = null;
				}
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null;
				}
				this.play_state = 1;
			} else {
				playQuestionAudio(url);
				this.getAudioEnded(this.$refs.audios[index], index)
				this.intervalId = setInterval(() => {
					if (this.play_state < 4) {
						this.play_state = this.play_state + 1;
					}
					if (this.play_state === 4) {
						this.play_state = 1;
					}
					if (!this.is_play) {
						this.play_state = 1;
					}
				}, 500);
			}
			this.is_play = !this.is_play;
		},
		vedioPlay(index) {
			if (index !== this.vedio_index) {
				this.$refs.vedio[this.vedio_index].pause();
			}
			this.vedio_index = index;
			this.$refs.vedio[this.vedio_index].playbackRate = this.double_speed;
		},
		getAudioEnded(ele, index) {
			// 判断是否音频结束
			// 点击播放后清除上一次的定时器
			// 如果数组中没有数据就是新播放的音频，重新开始定时器，，定时器结束后重置数据
			if (this.currentTimeId) {
				clearInterval(this.currentTimeId);
				this.currentTimeId = null;
			}
			if (!this.audioCurrentTime[index]) {
				this.audioCurrentTime[index] = ele.duration;
			}
			this.currentTimeId = setInterval(() => {
				this.audioCurrentTime[index] = this.audioCurrentTime[index] - 1;
				if (this.audioCurrentTime[index] < 0) {
					this.audioCurrentTime[index] = '';
					this.is_play = false;
					if (this.currentTimeId) {
						clearInterval(this.currentTimeId);
						this.currentTimeId = null;
					}
					if (this.intervalId) {
						clearInterval(this.intervalId);
						this.intervalId = null;
					}
					this.play_state = 1;
					pauseQuestionAudio(this.url);
				}
			}, 1000);
		},
		changePlayType(data) {
			let index = data.index || 0;
			this.dialogue.forEach((item, i) => {
				if (i === index) {
					item.isPlaying = data.isPlaying;
				} else {
					item.isPlaying = false;
				}
			})
			this.dialogue = [...this.dialogue];
		},
		getFilePath(url) {
			return getUploadedFilePath(url)
		},
		//    填空删除选词
		handleSelectClose(_item, _index) {
			let arr = [];
			this.questionData.description.forEach((descitem, descindex) => {
				if (descitem.type == 'words') {
					arr.push(descindex)
				}
			})
			arr.forEach((item, index) => {
				if (item == _index) {
					let a = this.questionData.description.splice(_index, 1, {
						type: this.questionData.description[_index].type,
						text: JSON.parse(this.content)[_index].text,
					});
					this.spareFillArr.splice(index, 1, item)
				}
			})
			// 去除答案和填空词数组中的对应元素
			for (let i = 0; i < this.fillArr.length; i++) {
				if (this.fillArr[i].item == _item.text.trim()) {
					this.fillArr.splice(i, 1, '');
					this.answerArr.splice(i, 1, '')
					this.questionData.myAnswer.splice(_index, 1, '')
					break;
				}
			}
			this.iActive = this.spareFillArr.filter(item => item != '')[0];    // 蓝色
		},
		resetConfuseList(list) {
			let arr = [...list];
			let newList = [];
			list.forEach(item => {    //  列表循环
				let index = parseInt(Math.random() * arr.length, 10);   // 取到随机的索引值
				newList.push(arr[index]);     //  往 newList 数组中添加一个元素
				arr.splice(index, 1)     //  把原数组的对应索引的元素删掉
			})
			return newList;
		},
		handleClickFillActive(index) {
			this.iActive = index;
		},
		// 判断页面中是否有视频
		handleHasVideo(data) {
			if (typeof data == 'object' && !Array.isArray(data)) {
				for (let key in data) {
					this.handleHasVideo(data[key])
				}
			} else if (typeof data == 'object' && Array.isArray(data)) {
				let len = data.length;
				for (let i = 0; i < len; i++) {
					this.handleHasVideo(data[i])
				}
			} else if (typeof data == 'string') {
				if (/(\.mp4)$/.test(data)) {
					if (data.indexOf(',') > -1) {
						let list = data.split(',');
						this.handleHasVideo(list)
					} else {
						this.has_video = true;
						this.$emit('hasVideo', true);
					}
				}
			}
		},
	}
}