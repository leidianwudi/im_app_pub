<template>
	<view class="content" @tap="onMenuHide">
		<view class="header">
			<view class="header_img">
				<image :src="fr_img" mode="widthFix"></image>
			</view>
		</view>
		<view class="friend_info">
			<view class="friend_name">
				<text>账号</text>
				<view class="nick_more">
				    <text>{{fr_name}}</text>
					<view class="hide">
						<micon type="arrowright" size=20></micon>
					</view>
				</view>
			</view>
			<view class="friend_signature">
				<text>昵称</text>	
				<view class="nick_more">
				    <text>{{fr_nick}}</text>
					<view class="hide">
						<micon type="arrowright" size=20></micon>
					</view>
				</view>
			</view>
			<view class="friend_nick" @tap="toUpdFriendNick" v-if="uiType == 1 || uiType == 3">
				<text>备注</text>
                <view class="nick_more nick_show">
					<text>{{fr_friendNickTip}}</text>
					<micon type="arrowright" size=20 v-if="uiType == 1 || uiType == 3"></micon>
				</view>
			</view>
			<view class="friend_signature">
				<text>签名</text>	
				<view class="nick_more">
				    <text>{{fr_text}}</text>
					<view class="hide">
						<micon type="arrowright" size=20></micon>
					</view>
				</view>
			</view>
		</view>
		
		<view class="apply_friend">
			<button type="primary" @tap="apply" v-if="uiType == 0">加为好友</button>
			<button type="primary" @tap="outGroupUserByAdmin" v-if="uiType == 5">移出群聊</button>
			<button type="primary" @tap="sendInfo(friendAccount)" v-if="uiType == 1">发消息</button>
		</view>
		
		<modal :show="modal9" @cancel="hide9" :custom="true" :fadein="true">
			<view class="modal_custom">
				<view class="prompt_title">请输入验证信息</view>
				<input placeholder="请输入" class="send_input" v-model="info" />
				<button @tap="send_info">立即提交</button>
			</view>
		</modal>
		
		<view class="menu" v-if="menu">
			<text></text>
			<view class="delFriend" @tap="del"><micon type="trash" size=22></micon><text>删除好友</text></view>
		</view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import util from '@/common/util.js';
import modal from "@/components/modal/modal";
import storage from '@/api/storage.js';
import micon from '@/components/m-icon/m-icon';
export default{
	components: {
		modal,
		micon
	},
	data(){
		return {
			fr_name:'',  			//用户账号
			fr_img:'',				//用户头像
			fr_nick:'',				//用户昵称
			fr_friendNickTip:'',	//我给好友添加的备注
			fr_text:'',				//用户签名
			modal9: false,			//控制添加好友时的验证信息弹窗
			info:'',  				//获取添加好友时的验证信息
			userEn: null, 			//我的详细信息
			// addFriend:false, 
			menu:false, 
			// outGroupByAdmin:false,
			friendEn:null,			//好友的详细信息
			groupEn:null,
			friendAccount:'',		//群聊的详细信息
			// userAccount: false,   备注栏
			// sendInfo: false   
			uiType: 0   // 0:加为好友界面ui  1:好友列表内查看好友信息ui 3:私聊界面查看好友信息ui 4:普通用户群内查看群用户ui 5: 群管理员群内查看群用户ui
		}
	},
	//res可能有：userAccount(不是好友) friendAccount(是好友)
	onLoad(res){
		let _this = this;
		this.menu = false;
		this.userEn = storage.getMyInfo();
		this.friendAccount = res.friendAccount ? res.friendAccount : res.userAccount;
        this.uiType = res.uiType;
		api.getUserByAccount({account: this.friendAccount},res=>{
			let data = api.getData(res);
			_this.fr_img = data.head;
			_this.fr_name = data.account;
			_this.fr_nick = data.nick;
			_this.fr_text = data.signature;
		});
		// 是好友的时候获取好友备注
		if(res.uiType === 1 || res.uiType === 3){
			let data = {
				account: res.friendAccount ? res.friendAccount : res.userAccount
			}
			this.reqFirendInfo(data);
			api.getFriendByAccount({
				account: this.userEn.account,
				friendAccount: this.friendAccount
			},res=>{
				let data = api.getData(res);
				_this.fr_friendNickTip = data.friendNickTip;
			})
		}
	},
	onShow(){
		let data = {
			account: this.friendAccount
		}
		this.reqFirendInfo(data);
		api.getFriendByAccount({
			account: this.userEn.account,
			friendAccount: this.friendAccount
		},res=>{
			let data = api.getData(res);
			this.fr_friendNickTip = data.friendNickTip;
		})
	},
	// 右上角更多按钮的显示切换
	onNavigationBarButtonTap(){
		if(this.uiType == 0) return;
	    this.menu = this.menu === true ? false : true;
	},
	methods:{
		// 右上角更多按钮隐藏
		onMenuHide(){
			this.menu = false;
		},
		//跳转到修改好友备注界面
		toUpdFriendNick(){
			if(this.userAccount === false) return;
		    if(this.menu === true) return;
			uni.navigateTo({
				url:"/pages/user/MyInfo/updMytext/updMytext?friendAccount=" + this.fr_name + '&value=' + this.fr_friendNickTip
			})
		},
		outGroupUserByAdmin(){
		    let groupId = storage.getGroupInfo();
			let _this = this;
			api.getGroupById({id: groupId}, res=>{
				_this.groupEn = api.getData(res);
			let data = {
				groupId: _this.groupEn.id,
				account: _this.userEn.account,
				friendAccount: _this.fr_name
			}
			uni.showModal({
				title:'群提示',
				content:'您确定要将'+_this.fr_name+'移出群聊？',
				success(res){
					if(res.confirm) _this.outUser(data);
				}
			})				
			})
		},
		outUser(postData){
            api.outGroupByAdmin(postData, res=>{
				let code = api.getCode(res);
				let msg = api.getMsg(res);
				if(code === 0){
					uni.showToast({
						title: msg,
						image:'/static/img/check-circle.png',
						duration:2000
					})
				    setTimeout(function(){
						uni.navigateBack({
							delta: 2
						})
					},500)
				}
			})
		},
		sendInfo(friendAccount){
			uni.navigateTo({
				url:'/pages/friend/chat/friendChat/friendChat?friendAccount=' + friendAccount
			})
		},
		del(){
			let _this = this;
            uni.showModal({
            	title:'删除好友',
				content:'您确定要删除好友？',
				success(res) {
					if(res.confirm){
						let data = {
							account: _this.userEn.account,
							friendAccount: _this.friendEn.account
						}
						api.delFriend(data, res=>{
							uni.navigateBack({
								delta:1
							})
						})
					}
				}
            })
		},
		reqFirendInfo(postData){
			let _this = this;
			api.getUserByAccount(postData, res=>{
				let data = api.getData(res);
				_this.friendEn = data;
				_this.fr_name = data.account;
				_this.fr_nick = data.nick;
				_this.fr_img = data.head;
				_this.fr_text = data.signature;
			})
		},
		hide9() {
			this.modal9 = false
		},
		apply(){
			this.modal9 = true;
			this.info = '';
		},
		send_info(){
			this.modal9 = false;
			uni.showLoading({
				title:"正在发送....."
			})
			let postData = {
				account: this.fr_name,
				fromAccount: this.userEn.account,
				msg: this.info				
			};							
			this.applyPass(postData);
		},
		applyPass(postData){
			api.applyFriend(postData, res => {
				let code = api.getCode(res);
				let msg = api.getMsg(res); 
				uni.hideLoading();
                if(code === 0){
					uni.showToast({
						title: msg,
						image:'/static/img/check-circle.png',
						duration:2000
					})
				}else {
					uni.showToast({
						title: "网络出错请稍候再试！",
						image:'/static/img/fail-circle.png',
						duration:2000
					})
				}
			})
		}
	}
}
</script>

<style>
	.nick_more{
		display:flex;
		justify-content:space-between;
	}
	.nick_more>text{
		vertical-align:bottom;
		color: #717171;
		font-size:18px;
		margin-right:15rpx;
	}	
	.menu{
		width:250rpx;
		height:auto;
		position:fixed;
		top:60px;
		right:5px;
		background:#4C4C4C;
		border-radius:7px;
	}
	.menu>text{
		display:inline-block;
		border-top: 10px transparent dashed;
		border-left: 10px transparent dashed;
		border-bottom: 10px #4C4C4C solid;
		border-right: 10px transparent dashed;
		position:absolute;
		top:-17px;
		right:10px;
	}
	.menu>view{
		border-radius:7px;
		margin:0 auto;
		padding:36rpx;
		color: #FEFEFE;
		text-align:center;
		display:flex;
		justify-content:space-between;
		align-items:center;
		font-size:14px;
	}
	.content{
		width:100%;
	}
	.header{
		width:100%;
		height:350rpx;
		display:flex;
		justify-content: center;
		align-items:center;
		margin-bottom:20rpx;
	}
	.header_img{
		width:250rpx;
		height:250rpx;
		border-radius:50%;
		overflow:hidden;
	}
	.header_img>image{
		width:100%;
		height:auto;
	}
	.friend_info{
		width:100%;
		height:auto;
		padding:25rpx;
		box-sizing:border-box;
		margin-bottom:20rpx;
	}
	.friend_info>view{
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:20rpx 0;	
		border-bottom:1px solid #F3F3F3;
	}
    .friend_info>view>text:nth-child(1){
		font-size:18px;
	}
	.friend_info>view>text:nth-child(2){
		color: #717171;
		font-size:18px;
	}
	.modal_custom{
		text-align:center;
	}
	.prompt_title {
		padding-bottom: 20rpx;
		font-size: 34rpx;
	}
	.send_input {
		margin: 30rpx 40rpx;
		border-bottom: 1rpx solid #E6E6E6;
		padding-bottom: 20rpx;
		font-size: 32rpx;
	}
	.friendInfoBtn{
		width:100%;
		display:flex;
		justify-content:space-between;
	}
	.friendInfoBtn>button{
		width:40%;
	}
	.hide{
		visibility:hidden;
	}
	.friend_nick{
		display:flex;
		justify-content:space-between;
	}
	.nick_show{
		width:70%;		
		display:flex;
		justify-content:flex-end;
	}
	.nick_show>text{
		overflow:hidden;
		text-overflow: ellipsis;
		white-space:nowrap;
	}
</style>
