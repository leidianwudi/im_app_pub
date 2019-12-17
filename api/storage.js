import util from '@/common/util.js';
import utilCore from '@/api/utilCore.js';

const myInfo = "myInfo";//用户详细信息的key
const groupInfo = "groupInfo";//群详细信息的key
const lastMsgIndex = "lastMsgIndex";//已读消息index

//封装保存本地数据操作
module.exports = {
	//保存我的数据
	setMyInfo: function(data){uni.setStorage({
		key: myInfo,
		data:data
	})},
	
	//获取我的数据
	getMyInfo: function(){
		utilCore.autoLoginUi();
		return uni.getStorageSync(myInfo);
	},
	
	 //退出登录
	 outLogin: function(){
	 	uni.removeStorage({
	 		key: myInfo
	 	})
	 },
	 
	 //保存群数据
	 setGroupInfo: function(data){uni.setStorage({
	 	key: groupInfo,
	 	data:data
	 })},
	 
	 //获取群数据
	 getGroupInfo: function(){
	 	return uni.getStorageSync(groupInfo);
	 },
	 
	 
	 // 保存最后一条聊天记录
	 setLastMsgIndex: function(data){uni.setStorage({
		key:'setmsg',
		data:data
	})},
	
	// 获取最后一条聊天记录
	getLastMsgIndex: function(type, groupId, friendAccount){
		return uni.getStorageSync('setmsg');
	},
	
	// getLastMsgIndex_key: function(type, groupId, friendAccount){
	// 	switch (type){
	// 		case 0:
	// 			return this.lastMsgIndex + "_0_" + groupId;

	// 		default:
	// 			return this.lastMsgIndex + "_1_" + friendAccount;
	// 	}
	// }
} 
