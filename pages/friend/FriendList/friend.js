import storage from "@/api/storage.js";
import api from "@/api/api.js";
import lastMsg from "@/api/lastMsg.js";
import util from "@/common/util.js";
import chinapy from '@/common/chinapy.js';
//最后一条消息操作
module.exports = {
	
	account: null, //我的账户
	page: 1, //当前消息第几页
	ui: null, //ui
	newList: [], //新的好友列表
	
	constructor(){},
	// 初始化
	initUi(ui, account) {
		this.ui = ui;
		this.account = account;
	},
	
	//关闭ui
	closeUi(){
		this.ui = null; //ui赋值为空
	},
	
	//获取好友列表
	getFriendList(){
		let postData = {
			account: this.account,
			page: 1,
			count: 99
		}
		this._getFriendsByAccount(postData);
	},
	
	//获取好友列表并保存到本地
	_getFriendsByAccount(postData){
		let _this = this;
		api.getFriendsByAccount(postData, res=>{
			let data = api.getData(res).data;
			//判断数据首字母是否存在并添加数据
			data.forEach(function(e){				
				let fristKey = chinapy.makePy(e.friendNickTip);
				_this.addFriend(fristKey, e);
			});
			//判断是否有新数据
			let newFriendList = _this._isNewFriend(data);
			storage.setFriendList(newFriendList, _this.refreshLastMsg.bind(_this));
		});
	},
	
	//判断是否有新数据并添加
	_isNewFriend(friendList){
		let old = storage.getFriendList();
		for(let i = 0; i < friendList.length; ++i){
			if(friendList[i].id != old[i].id){
				return friendList;
			}
		};
		return old;
	},
	
	//刷新好友列表ui数据
	refreshLastMsg(){
		let msg = storage.getFriendList();
		if(util.isEmpty(msg)) return;
		if(util.isEmpty(this.ui)) return;
		this.ui.friengList = [];  //删除旧数据
		// 关闭下拉刷新动画
		uni.stopPullDownRefresh();	
		console.log(msg);
		for(let i = 0; i < msg.length; ++i){
			this.ui.friengList.push(msg[i]);  //添加数据
		}
	},
	
	//判断首字母是否存在
	addFriend(fristKey, value){
		//如果首字母不存在就添加首字母+添加数据
		if(!this.isFriendsHasKey(fristKey)){
			let arr = {letter: fristKey, data: [value]};
			this.ui.friengList.push(arr);
		} else{    //如果首字母存在则追加数据
			let arr = this.getFriendsByKey(fristKey);
			arr.push(value);
		}
	},
	
	//查询key是否存在
	isFriendsHasKey(key){
		for(let value of this.ui.friengList)
		{
			if(value.letter === key){
				return true;
			}
		}
		return false;
	},
	
	//根据首字母返回好友数组
	getFriendsByKey(key){
		for(let value of this.ui.friengList)
		{
			if(value.letter === key){
				return value.data;
			}
		}
		return null;
	},
}