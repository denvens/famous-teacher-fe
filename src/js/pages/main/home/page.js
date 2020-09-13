import './page.scss'
import template from './page.tpl';
import questionLearn from '../../../modules/question';
import local from '../../../modules/localStorage';
import tools from '../../../modules/tools';
import config from '../../../../../config';
const {
	ajax, getUploadedFilePath,getUrlParams,frontendLog
} = tools;
import audio from '../../../modules/audio';
const { loadQuestionAudio } = audio;
const urlParams = getUrlParams();
import { mapState, mapActions } from 'vuex';
export default {
	template,
	data() {
		return {
			timeId: 0,
			studyText: '开始今日学习',
			levelId: '',
			headerBar: '',
			tipsText: '',
			tip: '',
			bgImg: '',     //  频道背景图
			order: 0,
			day: 0,    // 几天后开课
			questionList: [],
			lesson_list: [],
			today_lesson: {},
			audioList: [],
			options: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			isGoCourse: false,    //  进入学习页面防抖
			showHeader: false,
			isLoading: false,
			showTips: false,
			endCourse: true,    // 课程是否结束
			endBegun: true,    // 课程是否开始
		}
	},
	mounted() { 
		this.tip = 'tip';
		this.levelId = local.getStorage('levelId');
		//  后端预览扫码后进入学习页面 
		if (urlParams['lessonkey']) {
			this.goCourse(urlParams);
			return;
		}
		this.headerBar = 'headerBar';
		if (this.levelId && this.lesson_list.length == 0) {
			this.getLessonList(this.levelId)
		} else {
			this.showHeader = true;
		}
	},
	computed: {
		...mapState('question', {
				levelList: state => state.levelList
		})
	},
	methods: {
		...mapActions('question', ['getLevelList']),
		goCourse(lesson,text) {
			if (this.isGoCourse) {
				return;
			}
			this.isLoading = true;
			this.levelId = local.getStorage('levelId');
			this.isGoCourse = true;
			if ((!this.endCourse||!this.endBegun) && text == '看看其他课程') {
				this.showHeader = true;
				this.isLoading = false;
				this.isGoCourse = false;
				return;
			}
			this.$store.commit('question/setLessonInfo', lesson);
			this.$store.commit('question/setLevelId', this.levelId);
			ajax({
				method: 'get',
				url: 'lessons/' + lesson.lessonkey + '.json',
				requestUrl: config['UPLOAD_FILE_URL'],
				withCredentials: false
			}).then(res => {
				let res_data = res.data.questionList;
				res_data.forEach(item => {
					this.isLoading = false;
					item.questionData = JSON.parse(item.questionData);
					item.questionData.myAnswer = '';
					if (item.questionData.type == 'choice' || item.questionData.type == 'fourSection') {
						item.questionData.myAnswer = [];
					}
					if (item.questionData.type == 'choice') {
						item.questionData.addoption.forEach(addO => {
							if (addO.description.indexOf('\n') > -1) {
								let arr = addO.description.split('\n');
								let obj = []
								arr.forEach(arr_item => {
									obj.push('<p>'+ arr_item.trim() +'</p>');
								})
								addO.description = obj.join('');
							}
						})
					}
					if (item.questionData.type == 'fill') {
						item.questionData.myAnswer = [];
						item.questionData.originDesc = JSON.stringify(item.questionData.description);
					}
					if (item.questionData.type == "fourSection") {
						item.questionData.tenList.forEach((tenItem,index) => {
							tenItem.options = JSON.parse(JSON.stringify(this.options));
							tenItem.options.forEach((element,eleIndex) => {
								if (element.text) {
									element.status = 3;
								} else {
									tenItem.options.splice(eleIndex,1,{
										text: element,
										status: 3
									})
								}
							});
						})
					}
				})
				this.getAudio(res_data);
				window.wx.ready(() => {
					loadQuestionAudio(this.audioList)
				});
				if (!local.getStorage(this.levelId+'-'+lesson.id)) {
					local.setStorage(this.levelId+'-'+lesson.id,"[]");
				}
				frontendLog({
					openId: this.$store.state.app.openId,
					nickName: this.$store.state.app.nickName,
					userAgent:navigator.userAgent
				})
				questionLearn.load(res_data);
				questionLearn.start(0);
				this.isGoCourse = false;
				this.$router.push('/course/question');
			}).catch(err => {
				this.isLoading = false;
				this.showTips = true;
				this.tipsText = '暂无课程，请学习其他课程吧！';
				this.isGoCourse = false;
				console.log(err)
			})
		},
		// 预加载图片资源
		getAudio(data) {
			if (typeof data == 'object' && !Array.isArray(data)) {
				for (let key in data) {
					this.getAudio(data[key])
				}
			} else if (typeof data == 'object' && Array.isArray(data)) {
				let len = data.length;
				for (let i = 0; i < len; i++) {
					this.getAudio(data[i])
				}
			} else if (typeof data == 'string') {
				if (/(\.mp3)$/.test(data)) {
					if (data.indexOf(',') > -1) {
						let list = data.split(',');
						this.getAudio(list)
					} else {
						let url = getUploadedFilePath(data);
						if (this.audioList.indexOf(url) < 0) {
							this.audioList.push(url)
						}
					}
				}
			}
		},
		getId(_id) {
			this.getLessonList(_id)
		},
		getLessonList(levelId) {
			this.isLoading = true;
			this.$store.commit('question/setLevelId', levelId);
			ajax({
				url: '/user/lesson-list',
				withCredentials: true,
				data: {
					levelId
				}
			}).then(res => {
				if (res.success) {
					this.isLoading = false;
					this.endBegun = true;
					let res_data = res.data;
					let lessonsMap = res_data.lessonsMap;
					let beginAtTime = res_data.levelUser.beginAt.split('-').join('/');
					let nowTime = res_data.nowDate.split('-').join('/');
					let nowDate = new Date(nowTime).getTime();
					let beginAt = new Date(beginAtTime).getTime();
					let day = ((nowDate - beginAt) / 1000 / 3600 / 24);		
					let date_list = this.getAllDate(beginAtTime, nowTime);
					this.lesson_list = res_data.lessonList;
					if (res_data.lessonList.length === 0) {
						return;
					}
					this.lesson_list = res_data.lessonList.filter((item, index) => {
						item.time = date_list[index]
						return index <= day;
					})
					const beginAtDate = new Date(beginAtTime).setHours(0, 0, 0, 0);
					const nowDates = new Date(nowTime).setHours(0, 0, 0, 0);
					if (beginAtDate > nowDates) {
						this.endBegun = false;
						this.endCourse = true;
						this.day = (beginAtDate-nowDates)/1000/3600/24;
						this.studyText = '看看其他课程';
						this.getBgImg()
						return;
					}
					if (day >= res_data.lessonList.length) {
						this.endCourse = false;
						this.studyText = '看看其他课程';
						// 如果没有课程时显示看看其他课程，课程背景图使用频道主题图
						this.getBgImg()
					} else {
						this.endCourse = true;
						this.endBegun = true;
						this.today_lesson = this.lesson_list[this.lesson_list.length-1];
						this.getUploadFilePath(this.today_lesson);
						for (let a in lessonsMap) {
							if (a.indexOf(this.today_lesson.id) > -1) {
								this.studyText = '已学完，去复习';
								break;
							} else {
								this.studyText = '开始今日学习';
							}
						}
						this.lesson_list.splice(this.lesson_list.length-1,1)
					} 
					this.lesson_list = this.lesson_list.reverse()
				}
			}).catch(err => {
				console.log(err);
			})
		},
		getBgImg () {
			if (this.levelList.length == 0) {
				this.getLevelList().then(res => {
					res.allList.forEach(item => {
						if (item.id == local.getStorage('levelId')) {
							this.bgImg = getUploadedFilePath(item.image);
						}
					})
				})
			} else {
				this.levelList.forEach(item => {
					if (item.id == local.getStorage('levelId')) {
						this.bgImg = getUploadedFilePath(item.image);
					}
				})
			}
		},
		getUploadFilePath(obj) {
			if (obj.image) {
				obj.image = getUploadedFilePath(obj.image)
			}
			if (obj.audio) {
				obj.audio = getUploadedFilePath(obj.audio)
			}
			if (obj.video) {
				obj.video = getUploadedFilePath(obj.video)
			}
		},
		format (time) {
			let ymd = ''
			let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
			let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
			ymd += time.getFullYear() + '-' // 获取年份。
			ymd += mouth + '-' // 获取月份。
			ymd += day // 获取日。
			return ymd // 返回日期。
		 },
		 
		 getAllDate (start, end) {
			let dateArr = [];
			let db = new Date(start);
			let de = new Date(end);
			let unixDb = db.getTime();
			let unixDe = de.getTime();
			let stamp;
			const oneDay = 24 * 60 * 60 * 1000;
			for (stamp = unixDb; stamp <= unixDe;) {
				dateArr.push(this.format(new Date(parseInt(stamp))))
				stamp = stamp + oneDay
			}
			return dateArr
		 },
	}
}