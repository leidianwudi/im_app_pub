import util from '@/common/util.js';
//封装保存本地数据操作
module.exports = {

	 //判断是否登录
	isLogin: function(){
		let user = uni.getStorageSync('myInfo');
        return !util.isEmpty(user);
	},
	
	//跳转登录界面
	toLoginUi: function(){
		uni.reLaunch({
			url:'/pages/user/login/login'
		});
	},
	
	//判断是否登录,未登录就跳转
	autoLoginUi: function() {
		if(!this.isLogin()) this.toLoginUi();
	}
} 
