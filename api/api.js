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
	
	//登录到网关
	loginGate: function(postData, funSuccess) {httpUtil.post('gate/loginGate', postData, funSuccess);},
	
	//上传文件
	uploadFileToCache: function(path, funSuccess) {httpUtil.upload('external/uploadFileToCache', path, 'file', funSuccess);},
	
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
	
	//用户修改自己信息
	updMyInfo: function(postData, funSuccess) {httpUtil.post('user/updMyInfo', postData, funSuccess);},
	
	//查询自己信息
	getMyInfo: function(postData, funSuccess) {httpUtil.post('user/getMyInfo', postData, funSuccess);},
	
	//申请添加好友
	applyFriend: function(postData, funSuccess) {httpUtil.post('friend/applyFriend', postData, funSuccess);},
	
	//删除好友
	delFriend: function(postData, funSuccess) {httpUtil.post('friend/delFriend', postData, funSuccess);},
	
	//查询好友申请记录
	getApplyListByUser: function(postData, funSuccess) {httpUtil.post('friend/getApplyListByUser', postData, funSuccess);},
	
	//通过好友申请
	applyFriendAudit: function(postData, funSuccess) {httpUtil.post('friend/applyFriendAudit', postData, funSuccess);},
	
	//查询我的好友列表
	getFriendsByAccount: function(postData, funSuccess) {httpUtil.post('friend/getFriendsByAccount', postData, funSuccess);},
	
	//查询特定好友
	getFriendByAccount: function(postData, funSuccess) {httpUtil.post('friend/getFriendByAccount', postData, funSuccess);},
	
	//发送消息
	sendMsgToFriend: function(postData, funSuccess) {httpUtil.post('friend/sendMsgToFriend', postData, funSuccess);},
	
	//查询和好友的聊天记录
	getFriendMsg: function(postData, funSuccess) {httpUtil.post('friend/getFriendMsg', postData, funSuccess);},
	
	//修改好友备注昵称
	updFriendNickTip: function(postData, funSuccess) {httpUtil.post('friend/updFriendNickTip', postData, funSuccess);},
	
	//创建群聊
	createGroup: function(postData, funSuccess) {httpUtil.post('group/createGroup', postData, funSuccess);},
	
	//进入某个群
	groupIn: function(postData, funSuccess) {httpUtil.post('gate/groupIn', postData, funSuccess);},
	
	//获取用户所有的群
	getGroupByAccount: function(postData, funSuccess) {httpUtil.post('group/getGroupByAccount', postData, funSuccess);},
	
	//查询群内所有成员
	getUserByGroupId: function(postData, funSuccess) {httpUtil.post('group/getUserByGroupId', postData, funSuccess);},
	
	//拉好友进群
	friendJoinGroup: function(postData, funSuccess) {httpUtil.post('group/friendJoinGroup', postData, funSuccess);},
	
	//用户自己退出群
	outGroupByUser: function(postData, funSuccess) {httpUtil.post('group/outGroupByUser', postData, funSuccess);},
	
	//群主把用户移出群
	outGroupByAdmin: function(postData, funSuccess) {httpUtil.post('group/outGroupByAdmin', postData, funSuccess);},
	
	//群主解散群
	dissolveGroup: function(postData, funSuccess) {httpUtil.post('group/dissolveGroup', postData, funSuccess);},
	
	//群内发消息
	sendMsgToGroup: function(postData, funSuccess) {httpUtil.post('group/sendMsgToGroup', postData, funSuccess);},
		
	//查询群聊天记录
	getGroupMsg: function(postData, funSuccess) {httpUtil.post('group/getGroupMsg', postData, funSuccess);},
	
	//查询群的详细信息
	getGroupById: function(postData, funSuccess) {httpUtil.post('group/getGroupById', postData, funSuccess);},
	
	//修改群信息
	updGroupByHost: function(postData, funSuccess) {httpUtil.post('group/updGroupByHost', postData, funSuccess);},
	
	//查询所有最后一条聊天记录
	getLastMsgByAccount: function(postData, funSuccess) {httpUtil.post('msg/getLastMsgByAccount', postData, funSuccess);},
	
	//修改用户系统设置
	setUserSetting: function(postData, funSuccess) {httpUtil.post('user/setUserSetting', postData, funSuccess);},
	
	//查询用户系统设置
	getUserSetting: function(postData, funSuccess) {httpUtil.post('user/getUserSetting', postData, funSuccess);},
	
	//删除双方的聊天记录
	delFriendMsgByArr: function(postData, funSuccess) {httpUtil.post('friend/delFriendMsgByArr', postData, funSuccess);},
	
	//删除自己的聊天记录
	delFriendMsgInAccount: function(postData, funSuccess) {httpUtil.post('friend/delFriendMsgInAccount', postData, funSuccess);},
} 
