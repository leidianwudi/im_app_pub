<template>
	<view class="content">
		<view class="header">
			<view class="header_img">
				<image :src="fr_img" mode="widthFix"></image>
			</view>
		</view>
		<view class="friend_info">
			<view class="friend_name">
				<text>账号</text>
				<text>{{fr_name}}</text>				
			</view>
			<view class="friend_nick">
				<text>昵称</text>	
				<text>{{fr_nick}}</text>
			</view>
			<view class="friend_signature">
				<text>签名</text>	
				<text>{{fr_text}}</text>
			</view>
		</view>
		
		<view class="apply_friend">
			<button type="primary" @tap="apply" v-if="addFriend">加为好友</button>
            <view class="friendInfoBtn">
            	<button type="primary" @tap="sendMsg(friendEn.account, friendEn.head)" v-if="delFriend">发送消息</button>
            	<button type="primary" @tap="del" v-if="delFriend">删除好友</button>
            </view>
			
			<button type="primary" @tap="outGroupUserByAdmin" v-if="outGroupByAdmin">移出群聊</button>
		</view>
		
		<modal :show="modal9" @cancel="hide9" :custom="true" :fadein="true">
			<view class="modal_custom">
				<view class="prompt_title">请输入验证信息</view>
				<input placeholder="请输入" class="send_input" v-model="info" />
				<button @tap="send_info">立即提交</button>
			</view>
		</modal>
	</view>
</template>

<script>
import api from '@/api/api.js';
import util from '@/common/util.js';
import modal from "@/components/modal/modal";
import storage from '@/api/storage.js';
export default{
	components: {
		modal
	},
	data(){
		return {
			fr_name:'',
			fr_img:'',
			fr_nick:'',
			fr_text:'',
			modal9: false,
			info:'',
			userEn: null,
			addFriend:false,
			delFriend:false,
			outGroupByAdmin:false,
			friendEn:null,
			groupEn:null
		}
	},
	onLoad(res){
		this.userEn = storage.getMyInfo();
        if(res.friendAccount){
			if(!res.job) this.delFriend = true;
			if(res.admin === '2') this.outGroupByAdmin = true;
		}else{
			this.addFriend = true;
		}
		let data = {
			account: res.friendAccount ? res.friendAccount : res.account
		}
		this.reqFirendInfo(data);
	},
	methods:{
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
		sendMsg(account, head){
			uni.navigateTo({
				url:'/pages/friend/chat/friendChat/friendChat?friendNick='+account+'&friendHead='+head
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
				_this.fr_img = data.head;
				_this.fr_nick = data.nick;
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
</style>
