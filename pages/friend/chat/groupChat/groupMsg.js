import util from '@/common/util.js';
import tran from '@/common/tran.js';
import api from '@/api/api.js';
import time from '@/common/time.js';
import storage from '@/api/storage.js';

// 群消息操作
module.exports = {
	
	account: null, //我的账户
	groupId: null, //群id
	page: 1, //当前消息第几页
	ui: null, //ui
	changeIndex: 0, //我的最新消息临时id
	newMsgSum: 0, //临时消息条数

	constructor(){},
	// 初始化
	init(ui, account, groupId) {
		this.ui = ui;
		this.account = account;
		this.groupId = groupId;
		this.changeIndex = 0;
		this.newMsgSum = 0;
	},
	//获取群的消息列表
	getGroupMsg() {
		let data = storage.getGroupMsg(this.groupId);//群消息
		if (!util.isEmpty(data))
		{
			for (let i = 0; i < data.length; ++i)
			{
				this.autoPushMsg(data[i], false); //自动添加聊天数据
			}
		}
		this.getMsg();
	},
	//查询群消息
	getMsg() {
		let _this = this;
		let postData = {
			account: this.account,
			groupId: this.groupId,
			id: 1,
			page: 1,
			count: 15
		}
		api.getGroupMsg(postData, (res) => {
			let data = api.getPageList(res);
			storage.getGroupMsg(this.groupId, data);	//保存群消息到本地
			data.forEach(function(item, index) {
				_this.autoPushMsg(item, false); //自动添加聊天数据
			});
			_this.ui.scrollToLast();
		});
	},

	//发送群文本信息
	sendText(content) {
		let data = {
			account: this.account,
			groupId: this.groupId,
			type: 0,
			msg: content
		}
		this.send(data);
	},
	send(postData) {
		let _this = this;
		api.sendMsgToGroup(postData, res => {
			let code = api.getCode(res);
			let data = api.getData(res);
			if (code === 0) {} else {
				let index = _this.getFirstCacheMsgIndex(_this.ui.arrMsg);
				this.changeMsg(index, postData.msg, _this.ui.arrMsg, 2); //发送失败修改记录为失败状态
			}
		})
	},
	//自动添加消息数据  isPush:true 添加到消息后面，false添加到消息前面
	autoPushMsg(item, isPush) {
		item.msgType = this.getMsgType(item.msg); //获取消息类型	
		item.msg = this.getMsgData(item.msgType, item.msg); //获取消息内容
		//添加数据的情况下且是临时数据
		if (isPush && this.isCacheMsg(item, this.ui.arrMsg)) {
			let index = this.getFirstCacheMsgIndex(this.ui.arrMsg);
			this.changeMsg(index, item.msg, this.ui.arrMsg, 0, item.id, item.addTime); //修改记录为成功状态			
		} else if (this.isNewMsg(item, this.ui.arrMsg, isPush)) {
			item.change = 0;
			if (isPush) {
				this.ui.arrMsg.push(item);
			} else {
				this.ui.arrMsg.unshift(item);
			}
		}
	},
	//是否是临时数据
	isCacheMsg(item, arrMsg) {
		if (item.account != this.account) return false; //发送人不是自己
		if (util.isEmpty(arrMsg)) return false;
		if (this.newMsgSum > 0) {
			let cacheIndex = this.getFirstCacheMsgIndex(arrMsg);
			return true;
			//if(item.msg == arrMsg[cacheIndex].msg) return true;
		}
		return false;
	},
	//是否是新数据
	isNewMsg(item, arrMsg, isPush) {
		if (util.isEmpty(arrMsg)) return true;

		if (isPush) {
			let i = this.getLastMsgIndexBychang(arrMsg, 0);
			return (item.id > arrMsg[i].id);
		} else {
			return (item.id < arrMsg[0].id);
		}
	},
	//获取第一条临时数据的index
	getFirstCacheMsgIndex(arrMsg) {
		let findSum = 0; //找到次数
		for (let i = arrMsg.length - 1; i >= 0; --i) {
			if (arrMsg[i].change === 1) {
				findSum += 1; //找到一次
				if (findSum == this.newMsgSum) return i;
			}
		}
		return -1;
	},
	//获取状态为change的最后一条消息记录index
	getLastMsgIndexBychang(arrMsg, change) {
		for (let i = arrMsg.length - 1; i >= 0; --i) {
			if (arrMsg[i].change === change) return i;
		}
		return -1;
	},
	//获取消息内容
	getMsgData(type, msg) {
		switch (type) {
			case 1:
				return tran.json2Obj(msg.substr(6));
			case 2:
			    return tran.json2Obj(msg.substr(8));
			default:
				return msg;
		}
	},
	//返回消息类型
	getMsgType(msg) {
		if (msg.indexOf("[img]") != -1) { // != -1匹配到指定字符串   == -1没有匹配到指定字符串
			return 1;
		}else if (msg.indexOf("[voice]") != -1) {
			return 2;
		}
		return 0;
	},
	//修改数据状态 id:记录id addTime:记录时间
	changeMsg(index, msg, arrMsg, change, id = null, addTime = null) {
		if (util.isEmpty(arrMsg)) return true;

		arrMsg[index].change = change; //找到需要修改数据状态的记录并修改
		if (id != null) arrMsg[index].id = id;
		if (addTime != null) arrMsg[index].addTime = addTime;

		if (change === 0) --this.newMsgSum; //设置为成功时,数据-1
	},
	//直接将我的发言信息添加到本地
	immediateAddMsg(content, msgType) {
		let data = {
			id: --this.changeIndex,
			account: this.account,
			type: 0,
			msg: content,
			change: 1, //0正式数据  1临时数据 2失败数据
			msgType: msgType, //  客户端自定义的消息类型 0:文字消息 1:图片消息 
			addTime: time.getToday_YMD()
		};
		this.ui.arrMsg.push(data);
		++this.newMsgSum; //临时数据数加1
		this.ui.scrollToLast();
	}
}
