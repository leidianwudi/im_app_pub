import Vue from 'vue';
import Vuex from 'vuex';
import ws from "@/store/ws.js";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: false,
        hasLogin: false,
		userEn: null,	//用户信息
		ws: ws //webscoket链接,		
    },
    mutations: {
		//登录
        login(state, userEn) {
			state.userEn = userEn;
            state.hasLogin = true;
        },
		
		//登出
        logout(state) {
            state.userEn = null;
            state.hasLogin = false;
        },
		
    }
})

export default store;
