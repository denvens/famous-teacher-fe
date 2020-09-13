import Vuex from 'vuex';
import app from './app';
import question from './question'; 
const store = new Vuex.Store({
    modules: {
        app,
        question
    }
});

export default store;