import storage from "@/api/storage.js";
import api from "@/api/api.js";
import lastMsg from "@/api/lastMsg.js";
import util from "@/common/util.js";
import wsType from '@/api/msgType.js';
//最后一条消息操作
module.exports = {
	
	account: null, //我的账户
	page: 1, //当前消息第几页
	ui: null, //ui
	
	constructor(){},
	//开启监听
	init(_this){
		_this.$store.state.ws.addLister(wsType.friend_last, this.onWebScoketMsg.bind(this));
		_this.$store.state.ws.addLister(wsType.group_last, this.onWebScoketGroupMsg.bind(this));
	},
	// 初始化
	initUi(ui, account) {
		this.ui = ui;
		this.account = account;
	},
	
	//关闭ui
	closeUi(){		
		this.ui = null; //ui赋值为空
	},
	
	//获取最后一条消息的列表并保存到本地
	getLastMsg(){
		let data = {
			account: this.account,
			page: 1,
			count: 99
		};
		this._getLastMsgByAccount(data);
	},
	
    //获取消息并保存到本地
	_getLastMsgByAccount(postData){
		//let _this = this;
		api.getLastMsgByAccount(postData, res=>{
			let data = api.getData(res).data;
			if (util.isEmpty()) return;
			let resData = [];
			data.forEach((item)=>{
				if (item.msg.indexOf("[img]") != -1) item.msg = "[图片]";  //最后一条消息是图片消息，改变消息显示为[图片]
				if (item.msg.indexOf("[voice]") != -1) item.msg = "[语音]";  //最后一条消息是图片消息，改变消息显示为[图片]						
				lastMsg.countMsg(item, this.account);	//设置未读消息数据					
				//添加时间
				let timer = item.updTime.split(" ");
				timer = timer[1].slice(0, timer.length-5)
				item.time = timer;
				// 添加数据
				resData.push(item);
			});
			//关闭下拉刷新动画
			uni.stopPullDownRefresh();	
			this.ui.list = resData;  //赋值数据
			//保存到本地
			storage.setLastMsgIndex(resData);		
		});
	},
	
	//刷新ui数据
	refreshLastMsg(){
		let msg = storage.getLastMsgIndex();
		//console.log(msg);
		if(util.isEmpty(msg)) return;		
		if(util.isEmpty(this.ui)) return;
		//console.log(this.ui.list);
		
		//关闭下拉刷新动画
		uni.stopPullDownRefresh();			
		this.ui.list = msg;  //赋值数据
	},
	//监听好友消息
	onWebScoketMsg(res) {
		this.autoPushNewMsg(res);
	},
	//监听群聊消息
	onWebScoketGroupMsg(res){
		this.autoPushNewMsg(res);
	},
	//自动把单条记录添加到列表
	autoPushNewMsg(res){
		lastMsg.countMsg(res, this.account);	//设置未读消息数据
		let msg = storage.getLastMsgIndex(); 
		let isOld = false;
		
		for(let i = 0; i <= msg.length - 1; i++){
			if(msg[i].id === res.id){
				msg[i].id = res.id;
				msg[i].type = res.type;
				msg[i].title = res.title;
				msg[i].img = res.img;
				msg[i].friendAccount = res.friendAccount;
				msg[i].sendAccount = res.sendAccount;
				msg[i].groupId = res.groupId;
				msg[i].msg = res.msg;						
				msg[i].msgIndex = res.msgIndex;
				msg[i].updTime = res.updTime;
				msg[i].level = res.level;  //客户端使用的控制红点类型参数
				msg[i].msgNum = res.msgNum;	//客户端使用的控制红点数字
				isOld = true;  //找到旧数据
				break;
			}
		}
		if(!isOld) msg.unshift(res);  //没有找到旧数据，需要新添加
		//保存数据到本地然后刷新ui
		storage.setLastMsgIndex(msg, this.refreshLastMsg.bind(this)); 
		
	},
}