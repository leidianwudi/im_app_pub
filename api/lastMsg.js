import storage from "@/api/storage.js";
import util from "@/common/util.js";
// 保存最后一条未读消息
module.exports = {
	type: -1, //设置强制已读数据 0:私聊 1:群聊
	accORid: null, //设置强制已读数据 好友账户或群id
	// 设置未读消息数据
	countMsg(item, account){
		
		//如果最后一条消息发送者为自己，不显示红点消息提示
		if (item.sendAccount === account) {
			item.level = 0;
			item.msgNum = '';
			//如果最后一条消息发送者不为自己时显示红点消息提示
		} else {
			let readMsgIndex = storage.getMsgIndex(item.type, item.friendAccount != null? item.friendAccount : item.groupId);
			if(util.isEmpty(readMsgIndex)) readMsgIndex = 0;
			let count = item.msgIndex - readMsgIndex;  //获取消息差值
			
			//判断是否要略过
			if(this.type == item.type && (this.accORid == (!util.isEmpty(item.friendAccount) ? item.friendAccount : item.groupId))){
				// 略过时不显示红点
				count = 0;
				// 略过后把最新的已读数据保存
				this.lastMsgRead(this.type, this.accORid, item.msgIndex);
				// 清空略过数据
				this.type = -1;
				this.accORid = null;
			}
			if(count > 0){
				item.level = 1;
				item.msgNum = count;
			}else{
				item.level = 0;
				item.msgNum = '';
			}
		}
	},
	// 保存已读消息数据  type:类型 accORid 好友账号或群id msgIndex已读msgIndex
	lastMsgRead(type, accORid, msgIndex){
		storage.saveMsgIndex(type, accORid, msgIndex);
	},
	//设置特殊数据全部已读
	lastMsgRead2(type, accORid){
		this.type = type;
		this.accORid = accORid;
	}
}