import config from "@/static/app/config.js";
import tran from "@/common/tran.js";

//ws连接
export default {
	//连接地址
	url: config.wsUrl,
	// 连接状态
	IsOpen: false,

	//回调函数数组,数据为 (事件类型, 回调函数数组)
	mapFun: new Map(),

	//开始连接服务器
	open() {		
		if (this.IsOpen) return; //防止重复连接	

		//连接
		uni.connectSocket({
			url: this.url,
			complete: (res)=> {
				console.log(res);
			}
		});
		
		//打开连接
		uni.onSocketOpen((res) => {
			this.IsOpen = true;
			console.log('WebSocket连接打开成功！');
		});

		//连接失败监听
		uni.onSocketError((res) => {
			this.IsOpen = false;
			console.log('WebSocket连接打开失败，请检查！');
		});

		//连接关闭监听
		uni.onSocketClose((res) => {
			this.IsOpen = false;
			console.log('WebSocket 已关闭！');
		});
		
		this.onMessage();	//接收消息监听			
		
		this.autoJump();	//进行心跳
		
		console.log("ws已经开始连接");
	},

	//开始监听
	onMessage() {
		//接收消息监听
		uni.onSocketMessage((res) => {
			let resObj = res.data;
			console.log('收到服务器内容' + resObj);
			let type = resObj.type; //类型			
			if (this.mapFun.has(type)) {
				let arr = this.mapFun.get(type);
				for (let i = 0; i < arr.length; ++i) {
					arr[i](resObj.data); //函数回调
				}
			}
		});
	},

	//添加监听
	addLister(type, func) {
		if (this.mapFun.has(type)) {
			this.mapFun.get(type).push(func); //添加到数组最后
		} else {
			this.mapFun.set(type, [func]); //添加第一个数据
		}
	},

	//删除监听
	removeLister(type, func) {
		if (!this.mapFun.has(type)) return;

		let arr = this.mapFun.get(type); //回调函数数组
		for (let i = 0; i < arr.length; ++i) {
			if (arr[i] === func) {
				arr.splice(i, 1); //把值删除
				return;
			}
		}
	},

	//自动进行心跳,保持客户端的连接
	autoJump() {
		//设置心跳定时器
		setInterval(() => {		
			this.sendMessage("0"); //发送心跳数据
		}, 2000);
	},

	//发送数据
	sendMessage(msg) {		
		if (!this.IsOpen) return;
		console.log("心跳:" + msg);
		uni.sendSocketMessage({data: msg});
	}


}
