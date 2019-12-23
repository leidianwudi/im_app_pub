import util from '@/common/util.js';
import utilCore from '@/api/utilCore.js';

const myInfo 		= "myInfo"; 		//用户详细信息的key
const myHeadImg 	= "myHeadImg"; 		//头像url的key
const groupInfo 	= "groupInfo"; 		//群详细信息的key
const lastMsgIndex 	= "lastMsgIndex"; 	//已读消息index
const clientId 		= "clientId";  		//ws链接id

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
	setLastMsgIndex: function(data) {
		uni.setStorage({
			key: 'setmsg',
			data: data
		})
	},

	// 获取最后一条聊天记录
	getLastMsgIndex: function(type, groupId, friendAccount) {
		return uni.getStorageSync('setmsg');
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
		if(type === 0) return accORid + "_" + type;
		if(type === 1) return accORid + "_" + type;
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
