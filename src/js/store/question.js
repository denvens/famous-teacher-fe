import tools from '../modules/tools'
export default {
    namespaced: true,
    state: {
        levelId: 0,   // 频道ID
        levelName: '',
        lessonInfo: {
            lessonId: '',   // lessonID
            shareImg: '',    // 成就卡的分享图
            lessonOrder: 0,  
            name: ''
        },
        questionTime: null,
        question: {},
        levelList: [],
        questionIsFinished: false,
        questionIsPreved: false,
        mySubject: true,       //  是否有买过的课程   false是没有  true是有  默认有
    },
    mutations: {
        setQuestion(state, data) {
            state.question = data.questionData || {};
        },
        setIsFinished(state, type) {
            state.questionIsFinished = type;
        },
        setIsPreved(state, type) {
            state.questionIsPreved = type;
        },
        setLevelId(state, data) {
            state.levelId = data;
        },
        setLevelList(state, data) {
            state.levelList = data;
        },
        setLessonInfo (state, data) {
            state.lessonInfo = {...data};
        },
        setLevelName (state, data) {
            state.levelName = data;
        },
        setQuestionTime (state, data) {
            state.questionTime = data;
        },
    },
    getters: {
        getQuestion(state) {
            return state.question;
        },
        getIsFinished(state) {
            return state.questionIsFinished;
        },
        getIsPreved(state) {
            return state.questionIsPreved;
        },
        getLevelId(state) {
            return state.levelId;
        },
        getLessonId(state) {
            return state.lessonInfo.id;
        },
        getShareImg(state) {
            return state.lessonInfo.shareImage;
        },
        getLessonOrder (state) {
            return state.lessonInfo.order || 0;
        },
        getLevelName (state) {
            return state.levelName || '旅行英语';
        },
        getLessonName (state) {
            return state.lessonInfo.name || '旅行英语';
        },
        getTime (state) {
            return state.questionTime|| {};
        }
    },
    actions: {
        getLevelList({ state, commit }) {
            return new Promise((resolve, reject) => {
                tools.ajax({
                    url: '/user/level-list',
                    withCredentials: true,
                    data: {
                        subjectId: 1000000
                    }
                }).then(res => {
                    if (res.success) {
                        let res_data = res.data;
                        commit('setLevelList', res_data.allList);
                        resolve(res_data)
                    }
                }).catch(err => {
                    console.log(err);
                })
            })
        },
    }
};