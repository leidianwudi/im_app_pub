<template>
	<view class="content background">
		<view class="friendImg">
			<view class="imgSize">
				<image :src="friendHeadImg" mode="widthFix"></image>
			</view>
		</view>
		<view class="test friendName">
			<text>{{friendAccount}}</text>
		</view>
		<view class="test tips_test">
			<text>向你发送了抖一抖</text>
		</view>
		
		<view class="btn_row">
			<view class="btn_style refuse" @tap="refuse">
				<micon type="phone-filled" size=55 color="#fff" class="rotate_phone"></micon>				
			</view>
			
			<view class="btn_style receive" @tap="receive">
				<micon type="phone-filled" size=55 color="#fff"></micon>				
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import storage from '@/api/storage.js';
import micon from '@/components/m-icon/m-icon';
export default{
	components: {
		micon
	},
	data() {
		return {
			friendAccount: "", //好友账号
			friendHeadImg: '', //好友头像
			userEn: null, //我的详细信息
		}
	},
	onLoad(res) {
		this.userEn = storage.getMyInfo();//获取我的信息
		this.friendAccount = res.friendAccount; //获取好友账户
		this.getFriendInfo();//获取好友信息
	},
	methods:{
		//查询好友信息
		getFriendInfo(){
			api.getFriendByAccount({
				account: this.userEn.account,
				friendAccount: this.friendAccount 
			}, (res)=>{
				if(api.getCode(res) == 0) this.friendHeadImg = api.getData(res).friendHead;
			})
		},
		//拒绝抖一抖邀请(返回上一级界面)
		refuse(){
			uni.navigateBack({
				delta: 1
			})
		},
		//接收抖一抖邀请(跳转到好友聊天界面)
		receive(){
			uni.navigateTo({
				url:'/pages/friend/chat/friendChat/friendChat?friendAccount='+ this.friendAccount
			});	
		}
	}
}
</script>

<style>
	.background{
		width: 100%;
		height: 100vh;
		background-image: linear-gradient(-90deg, #cfd9df 0%, #e2ebf0 100%);
	}
	.friendImg{
		width:100%;
		height:40vh;
		display:flex;
		justify-content:center;
		align-items: center;
	}
	.imgSize{
		width:400rpx;
		height:400rpx;
		border-radius:50%;
		overflow:hidden;
	}
	.imgSize>image{
		width:100%;
		height:100%;
	}
	.test{
		text-align:center;
		color:#1A1A1A;
	}
	.friendName{
		font-size:28px;
	}
	.tips_test{
		margin-top:20rpx;
		font-size:18px;
	}
	.btn_row{
		width:80%;
		margin:0 auto;
		display:flex;
		justify-content:space-between;
		position:fixed;
		bottom:200rpx;
		left:50%;
		transform:translateX(-50%);
	}
	.btn_style{
		width:160rpx;
		height:160rpx;
		border-radius:50%;
		display:flex;
		justify-content:center;
		align-items: center;
	}
	.refuse{
		background-color:#ff596a;
	}
	.receive{
		background-color:#00d96e;		
	}
	.rotate_phone{
		transform:rotate(134deg);
	}
</style>
