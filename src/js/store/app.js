export default {
    namespaced: true,
    state: {
        nickName:'',
        profileUrl:'',
        openId:''
    },
    mutations: {
        setUserData(state,data){
            state.nickName = data.nickName || '';
            state.profileUrl = data.headImgUrl || '';
            state.openId = data.openId || '';
        }
    },
    getters: {
        
    }
};