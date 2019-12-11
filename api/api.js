import httpUtil from '@/common/httpUtil.js';

//网络操作封装
module.exports = {
	//取返回数据内,code数据
	getCode: function(res) {return res.data.code},
	
	//取返回数据内,msg数据
	getMsg: function(res) {return res.data.msg},
	
	//取返回数据内,data数据
	getData: function(res) {return res.data.data},
	
	//取返回数据内,page分页的列表数据.只返回分页列表数据,不返回总页数等数据
	getPageList: function(res) {return res.data.data.data},
	
	//查询广告轮播图
	getCarousel: function(funSuccess) {httpUtil.post('carousel/getCarousel', {}, funSuccess);},
	
	//查询公告
	getPublicGongGao: function(funSuccess) {httpUtil.post('sysMessage/getPublicGongGao', {}, funSuccess);},
	
	//登录
	userLogin: function(postData, funSuccess) {httpUtil.post('user/userLogin', postData, funSuccess);},
	
	//注册
	userReg: function(postData, funSuccess) {httpUtil.post('user/userRegister', postData, funSuccess);},
	
	//搜索用户
	getUserByAccount: function(postData, funSuccess) {httpUtil.post('user/getUserByAccount', postData, funSuccess);},
	
	//申请添加好友
	applyFriend: function(postData, funSuccess) {httpUtil.post('friend/applyFriend', postData, funSuccess);},
	
	//删除好友
	delFriend: function(postData, funSuccess) {httpUtil.post('friend/delFriend', postData, funSuccess);},
	
	//查询好友申请记录
	getApplyListByUser: function(postData, funSuccess) {httpUtil.post('friend/getApplyListByUser', postData, funSuccess);},
	
	//通过好友申请
	applyFriendAudit: function(postData, funSuccess) {httpUtil.post('friend/applyFriendAudit', postData, funSuccess);},

	//用户修改自己信息
	updMyInfo: function(postData, funSuccess) {httpUtil.post('user/updMyInfo', postData, funSuccess);},
	
	//查询自己信息
	getMyInfo: function(postData, funSuccess) {httpUtil.post('user/getMyInfo', postData, funSuccess);},
	
	//创建群聊
	createGroup: function(postData, funSuccess) {httpUtil.post('group/createGroup', postData, funSuccess);},
	
	//获取用户所有的群
	getGroupByAccount: function(postData, funSuccess) {httpUtil.post('group/getGroupByAccount', postData, funSuccess);},
	
	//查询群内所有成员
	getUserByGroupId: function(postData, funSuccess) {httpUtil.post('group/getUserByGroupId', postData, funSuccess);},
	
	//获取我的好友列表
	getFriendByAccount: function(postData, funSuccess) {httpUtil.post('friend/getFriendByAccount', postData, funSuccess);},
	
	//发送消息
	sendMsgToFriend: function(postData, funSuccess) {httpUtil.post('friend/sendMsgToFriend', postData, funSuccess);},
	
	//查询所有最后一条聊天记录
	getLastMsgByAccount: function(postData, funSuccess) {httpUtil.post('msg/getLastMsgByAccount', postData, funSuccess);},
	
	//查询和好友的聊天记录
	getFriendMsg: function(postData, funSuccess) {httpUtil.post('friend/getFriendMsg', postData, funSuccess);},
} 
