import util from '@/common/util.js';
import utilCore from '@/api/utilCore.js';

const myInfo 		= "myInfo"; 		//用户详细信息的key
const myHeadImg 	= "myHeadImg"; 		//头像url的key
const groupInfo 	= "groupInfo"; 		//群详细信息的key
const lastMsgIndex 	= "lastMsgIndex"; 	//已读消息index
const clientId 		= "clientId";  		//ws链接id
const userInfo 		= "userInfo"; 		//账号密码的key
const lastMsg       = "lastMsg";        //最后一条消息列表的key
const friendList       = "friendList";        //好友列表的key
//封装保存本地数据操作
module.exports = {
	//保存我的数据
	setMyInfo: function(data) {
		uni.setStorageSync(myInfo, data);
	},

	//获取我的数据
	getMyInfo: function() {
		utilCore.autoLoginUi();
		return uni.getStorageSync(myInfo);
	},

	//退出登录
	outLogin: function() {
		uni.removeStorage({
			key: myInfo
		})
	},
	
	//保存用户账号和密码
	setMyUserInfo: function(data) {
		uni.setStorageSync(userInfo, data);
	},
	
	//获取用户账号和密码
	getMyUserInfo: function() {
		return uni.getStorageSync(userInfo);
	},
	
	//删除用户账号和密码
	delMyUserInfo: function() {
		uni.removeStorage({
			key: userInfo
		})
	},

	//保存群数据
	setGroupInfo: function(data) {
		uni.setStorage({
			key: groupInfo,
			data: data
		})
	},

	//获取群数据
	getGroupInfo: function() {
		return uni.getStorageSync(groupInfo);
	},


	// 保存最后一条聊天记录
	setLastMsgIndex: function(data, fun) {
		uni.setStorage({
			key: lastMsg,
			data: data,
			success: fun
		})
	},

	// 获取最后一条聊天记录
	getLastMsgIndex: function() {
		return uni.getStorageSync(lastMsg);
	},
	
	// 保存好友列表
	setFriendList: function(data) {
		uni.setStorage({
			key: friendList,
			data: data
		})
	},
	
	// 获取好友列表
	getFriendList: function() {
		return uni.getStorageSync(friendList);
	},

	//保存头像
	setHeadImg: function(url) {
		uni.downloadFile({
			url: url,
			success: res => {
				uni.setStorage({
					key: myHeadImg,
					data: res.tempFilePath				
				});
			},
		});
	},

	//获取头像
	getHeadImg: function() {
		return uni.getStorageSync(myHeadImg);
	},

    //保存ws链接id
	saveClientId(id){
		uni.setStorageSync(clientId, id);
	},
	//获取ws链接id
	getClientId(){
		return uni.getStorageSync(clientId);
	},
	
	//封装聊天计数的key
	getMsgKey(type, accORid){
		return this.lastMsgIndex + "_" + type + "_" + accORid;
	},
	
	//保存聊天计数
	saveMsgIndex(type, accORid, msgIndex){
		uni.setStorageSync(this.getMsgKey(type, accORid), msgIndex);
	},
		
	//获取聊天计数
	getMsgIndex(type, accORid){
		return uni.getStorageSync(this.getMsgKey(type, accORid));		
	}
}
