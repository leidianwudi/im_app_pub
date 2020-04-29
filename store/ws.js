import config from "@/static/app/config.js";
import tran from "@/common/tran.js";
import storage from "@/api/storage.js";
import util from "@/common/util.js";
import api from "@/api/api.js";

//ws连接
export default {
	//连接地址
	url: config.wsUrl,
	// 连接状态
	isOpen: false,
	//是否登录到逻辑网关
	isLoginGate: false,
	//ws连接Id
	clientId: "",
	//用户账号
	account: "", 

	//回调函数数组,数据为 (事件类型, 回调函数数组)
	mapFun: new Map(),
	//初始化
    init(){
		this.autoTry();	//开始自动执行定时器
		let userEn = storage.getMyInfo();
		if(util.isEmpty(userEn)) return;
		this.account = userEn.account; //赋值账号		
	},
	// 设置账号
	setAccount(account){
		this.account = account;  //获取登录成功的用户账号
		this.isLoginGate = false; //重新登录网关
	},
	//开始连接服务器
	open() {		
		console.log("ws开始连接");
		if(util.isEmpty(this.account)) return;//没有账户就是未登录
		if (this.IsOpen) return; //防止重复连接	

		uni.closeSocket();		//容错,先关闭连接
		//连接
		uni.connectSocket({
			url: this.url,
			complete: (res)=> {
				console.log(res);
			}
		});
		
		//打开连接,只有连接成功才执行回调
		uni.onSocketOpen((res) => {
			this.wsSuccess();
		});

		//连接失败监听
		uni.onSocketError((res) => {
			this.wsFail();
		});

		//连接关闭监听
		uni.onSocketClose((res) => {
			this.wsFail();
		});
		
		this.onMessage();	//接收消息监听					
		
		console.log("ws连接结束");
	},
	//关闭连接
	close(){
		uni.closeSocket();
		this.mapFun = new Map(); //重新赋值清空旧数据
	},
	//ws连接成功
	wsSuccess(){
		this.isOpen = true;
		this.isLoginGate = false;
	},
	//ws断线
	wsFail(){
		this.isOpen = false;
		this.isLoginGate = false;
		this.clientId = '';
	},

	//开始监听
	onMessage() {
		//接收消息监听
		uni.onSocketMessage((res) => {
			//console.log('收到服务器内容1' + res);
			let resObj = tran.json2Obj(res.data);
			console.log('收到服务器内容2' + res);
			let type = resObj.type; //类型	
			if(type == "init")
			{				
				this.clientId = resObj.clientId; //重新获取ws连接id
				this.isLoginGate = false;
				this.autoLoginGate(); //尝试登录网关
			}
			else if(type == "12")//抖屏消息
			{
				if (resObj.data.account == this.account) return;//自己发的不提示
				uni.navigateTo({
					url:'/pages/friend/chat/shake/shake?friendAccount='+ resObj.data.toAccount
				});	
			}
			else if (this.mapFun.has(type)) {
				let arr = this.mapFun.get(type);
				for (let i = 0; i < arr.length; ++i) {
					arr[i](resObj.data); //函数回调
				}
			}
		});
	},
	
	//保存ws链接id
    saveClientId(clientId){
		storage.saveClientId(clientId);
	},
	
	//登录网关
	autoLoginGate(){
		console.log(this.account +'_' + this.clientId);
		if(this.isLoginGate) return; //如果已经登录可不用登录
		if(util.isEmpty(this.account) || util.isEmpty(this.clientId)) return;
		api.loginGate({
			account: this.account,
			clientId: this.clientId
		}, res=>{
			console.log('已登录网关成功' + res);
			console.log(this.account + '_' + this.clientId);
			this.isLoginGate = true;  //登录成功设置已登录状态
		})
	},

	//添加监听
	addLister(type, func) {
		//console.log("开始添加监听" + type + "_" + func)
		if (this.mapFun.has(type)) {
			this.mapFun.get(type).push(func); //添加到数组最后			
		} else {
			this.mapFun.set(type, [func]); //添加第一个数据
		}
		//console.log("监听已经添加:" + this.mapFun.get(type));
	},

	//删除监听
	removeLister(type, func) {
		if (!this.mapFun.has(type)) return;

		//console.log("开始删除监听" + type + "_" + func)
		let arr = this.mapFun.get(type); //回调函数数组
		for (let i = 0; i < arr.length; ++i) {
			console.log("比较:" + arr[i] + "和" + func)
			if (arr[i] === func) {
				console.log("监听已经删除" + arr);
				arr.splice(i, 1);//把值删除
				//console.log("监听已经删除" + arr);
				//console.log(this.mapFun.get(type));
				//this.mapFun.set(type, arr); //赋值
				return;
			}
		}
	},

	//开始自动执行定时器
	autoTry() {
		//设置定时器
		setInterval(() => {		
			this.autoTryDo(); //执行自动操作
		}, 20000);
	},

	//执行自动操作
	autoTryDo() {		
		if (!this.isOpen) 
		{
			this.open();	//没开启连接就尝试连接
		}			
		else
		{
			this.autoLoginGate(); //尝试登录网关
			uni.sendSocketMessage({data: "0"}); //发送心跳消息
		}		
	}


}
