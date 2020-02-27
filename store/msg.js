
//聊天缓存
export default {
	mapFirstMsg: new Map(),	//好友聊天数据
	mapGroupMsg: new Map(),	//群聊天数据 
	
	
	//取好友消息
	getFriendMsg(friendAccount)
	{
		if (this.mapFirstMsg.has(friendAccount))
			return mapFirstMsg.get(friendAccount);
			
		return null;
	}
	
	//保存好友消息
	setFriendMsg(friendAccount, msg)
	{
		if (this.mapFirstMsg.has(friendAccount))
			return mapFirstMsg.get(friendAccount);
			
		return null;
	}
}