//接收ws数据消息类型
module.exports = {
	app_permission: 0, //app权限
	friend_chat: 10, //好友聊天消息
	friend_red: 11, //好友红包消息
	friend_shake: 12, //抖屏消息
	friend_last: 99, //好友最后未读消息
	group_chat: 100, //用户群聊天消息
	group_red: 101, //用户群聊天消息
	group_system: 102, //群系统消息
	group_last: 199 //群聊最后未读消息
}
