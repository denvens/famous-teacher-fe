import './page.scss'
import template from './page.tpl';
import tools from '../../../modules/tools';
const {beijingTime,getBeijingTimeData,ajax,getUploadedFilePath} = tools;
import local from '../../../modules/localStorage';
import config from '../../../../../config';
import audio from '../../../modules/audio';
const { loadQuestionAudio } = audio;
import questionLearn from '../../../modules/question';
export default {
    template,
    data() {
        return {
            // weeks: ['Sun', 'Mon', 'Tue', "Wed", "Thu", "Fri", "Sat"],
            headerBar: '',
            weeks: ['S', 'M', 'T', "W", "T", "F", "S"],
            monthList:['','January','February','March','April','May','June','July','August','September','October','November','December'],
            options: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            calendarYear:0,//当前日历的年
            calendarMonth:0,//当前日历的月
            calendarDay:0,//当前日历的日（暂时未用到该数据）
            monthFirstWeek:0,//日历当前月的第一天的星期
            monthDayList:[],
            leftIcon:require('../../../../imgs/left-icon.png'),
            rightIcon:require('../../../../imgs/right-icon.png'),
            todayData:{},//当天的数据，里面字段包含year、month、day
            learnTypeText:'',//最上面 提示当天学习状态文字
            dayOrder:'',//课程name
            dayType:'已打卡',//打卡状态
            dayTitle:'',//标题
            selectWeekIndex:0,//所选择的是一周的第几天（下标）
            courseStartTime:1569340800000,//课程开始时间
            serverTime:1569557857410,//服务器时间
            courseData:{},//处理完之后的课程数据
            isStart:true,//当前选中的日历是否已经开始
            showHeader:false,
            levelId:0,
            calendarDayData:{},
            audioList:[]
        }
    },
    mounted() {
        this.headerBar = 'headerBar';
        if (local.getStorage('levelId')) {
			this.getCalendarData(local.getStorage('levelId'))
		} else {
			this.showHeader = true;
		}
    },
    computed: {
        
    },
    methods: {
        getId(id){
            this.getCalendarData(id)
        },
        getCalendarData(id){
            this.levelId = id;
            // 获取学习状态
            ajax({
                url:'/subject/lesson-record',
                data:{
                    subjectId:1000000,
                    levelId:this.levelId
                },
                contentType:'application/json'
            }).then(res=>{
                this.serverTime = res.data.nowDate;
                this.courseStartTime = res.data.vipBeginTime.replace(/\-/g,'/');
                let dateObj = getBeijingTimeData(this.serverTime);
                this.todayData = {...dateObj};
                this.calendarYear = this.todayData.year;
                this.calendarMonth = this.todayData.month;
                let lessonRecord = res.data.lessonList || [];
                let nowDate = new Date(this.serverTime.replace(/\-/g,'/')).getTime();
                let vipBeginTime = new Date(this.courseStartTime).getTime();
                let sendDays = Math.ceil((nowDate - vipBeginTime)/1000/3600/24);
                // 获取lesson列表
                ajax({
                    url:'/user/lesson-send-list',
                    data:{
                        levelId: this.levelId,
                        sendDays:sendDays
                    },
                    // contentType:'application/json'
                }).then(response=>{
                    let lessonIds = response.data || [];
                    lessonIds = lessonIds.map(item=>{
                        lessonRecord.forEach(data=>{
                            if(item.lessonId==data.lessonId){
                                item = {...data,...item};
                            }
                        })
                        return item;
                    })
                    this.dealCourseList(lessonIds);
                    this.initCalendar();
                }).catch(e=>{
                    console.log(e)
                })
            }).catch(e=>{
                console.log(e)
            })
            
        },
        dealCourseList(list){
            this.courseData = {};
            let courseStartTime = new Date(this.courseStartTime).getTime();
            let serverTime = new Date(this.serverTime).getTime();
            let startDays = Math.ceil((serverTime - courseStartTime)/1000/3600/24);
            list.forEach((item,index)=>{
                let date = beijingTime(courseStartTime-0+index*24*3600*1000);
                let data = {...item};
                if(index>=startDays){
                    data.isStart = false;
                }else{
                    data.isStart = true;
                }
                this.courseData[date] = data;
            })
        },
        initCalendar(){
            
            this.monthDayList = [];
            let nextCalendarYear = this.calendarYear;
            let nextCalendarMonth = this.calendarMonth;
            if(this.calendarMonth==12){
                nextCalendarYear = this.calendarYear - 0 + 1;
                nextCalendarMonth = 1;
            }else{
                nextCalendarMonth = this.calendarMonth - 0 + 1;
            }
            let monthFirstDay = new Date(this.calendarYear+'/'+this.calendarMonth+'/01').getTime();
            let nextMonthFirstDay = new Date(nextCalendarYear+'/'+nextCalendarMonth+'/01').getTime();
            this.monthFirstWeek = new Date(this.calendarYear+'/'+this.calendarMonth+'/01').getDay();
            let nextMonthFirstWeek = new Date(nextCalendarYear+'/'+nextCalendarMonth+'/01').getDay();
            let num = (nextMonthFirstDay-monthFirstDay)/1000/3600/24 + this.monthFirstWeek;
            for(let i=0;i<num;i++){
                
                let dateText = this.calendarYear+'/'+this.calendarMonth+'/'+((i - this.monthFirstWeek) + 1);
                let obj = this.courseData[dateText] || {};
                if(i>=this.monthFirstWeek){
                    obj.day = (i - this.monthFirstWeek) + 1;
                    if(this.todayData.year==this.calendarYear&&this.todayData.month==this.calendarMonth&&this.todayData.day==obj.day){
                        let learnTypeList = ['','已打卡','未打卡'];
                        this.isStart = obj.isStart;
                        this.dayOrder = obj.order;//课程序号
                        // this.dayType = learnTypeList[obj.learnType];//打卡状态
                        this.dayTitle = obj.lessonName;//标题
                        obj.isToday = true;
                        obj.isSelect = true;
                        if(obj.status){
                            this.learnTypeText = '今日已学习'
                        }else if(obj.lessonId){
                            this.learnTypeText = '今日未学习'
                        }else{
                            this.learnTypeText = '今日未开课'
                        }
                        this.selectWeekIndex = i % 7;
                        this.calendarDayData = {...obj};
                    }

                    obj.index = i % 7;
                }
                this.monthDayList.push(obj);
            }
        },
        nextMonth(){
            if(this.calendarMonth==12){
                this.calendarYear = this.calendarYear - 0 + 1;
                this.calendarMonth = 1;
            }else{
                this.calendarMonth = this.calendarMonth - 0 + 1;
            }
            this.initCalendar();
        },
        preMonth(){
            if(this.calendarMonth==1){
                this.calendarYear = this.calendarYear - 0 - 1;
                this.calendarMonth = 12;
            }else{
                this.calendarMonth = this.calendarMonth - 0 - 1;
            }
            this.initCalendar();
        },
        selectDay(data,index){
            if(!data.day){
                return;
            }
            this.monthDayList.forEach(item=>{
                item.isSelect = false;
            })
            let monthItem = this.monthDayList[index];
            let text = monthItem.isToday ? '今' : '当';
            if(monthItem.status){
                this.learnTypeText = text + '日已学习'
            } else if(monthItem.lessonId){
                this.learnTypeText = text + '日未学习'
            } else {
                this.learnTypeText = text + '日未开课'
            }
            if (monthItem.status == false){
                this.learnTypeText = text + '日已补学'
            } 
            let learnTypeList = ['','已打卡','未打卡'];
            this.isStart = data.isStart;
            this.dayOrder = data.order;//课程序号
            // this.dayType = learnTypeList[data.learnType];//打卡状态
            this.dayTitle = data.lessonName;//标题
            let obj = {...data};
            obj.isSelect = true;
            this.$set(this.monthDayList, index, obj)
            this.calendarDayData = {...data};
            if(this.selectWeekIndex===data.index){
                return;
            }
            this.selectWeekIndex = data.index;
        },
        goLearn(){
            if(!this.calendarDayData.lessonKey){
                return;
            }
            this.$store.commit('question/setLessonInfo', {
                id: this.calendarDayData.lessonId,
                order: this.calendarDayData.order,
                shareImage: this.calendarDayData.shareImage || '',
                name: this.calendarDayData.lessonName
            });
			this.$store.commit('question/setLevelId', this.levelId);
			ajax({
				method: 'get',
				url: '/lessons/' + this.calendarDayData.lessonKey + '.json',
				requestUrl: config['UPLOAD_FILE_URL'],
				withCredentials: false
			}).then(res => {
				let res_data = res.data.questionList;
				res_data.forEach(item => {
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
				loadQuestionAudio(this.audioList)
				window.wx.ready(() => {
					loadQuestionAudio(this.audioList)
                });
                if (!local.getStorage(this.levelId+'-'+this.calendarDayData.lessonId)) {
					local.setStorage(this.levelId+'-'+this.calendarDayData.lessonId,"[]");
				}
                questionLearn.load(res_data);
				questionLearn.start(0);
				this.$router.push('/course/question');
			})
        },
        // 预加载音频资源
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
    }
    }