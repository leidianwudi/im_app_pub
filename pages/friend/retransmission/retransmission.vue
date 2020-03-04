<template>
	<view class="content" style="padding:0;">
		<view class="search_box">
			<input type="text" value="" placeholder="搜索"/>
			<micon type="search" size=28 class="search_icon"></micon>
		</view>
		<view class="test">最近聊天</view>
		
		<!-- 最近聊天列表 -->
		<block v-for="(item, index) in list" :key="index">
			<listcell :last="true" class="row" @tap="sendMsg(item)">
				<view class="news_left">
					<image :src="item.type === 1 ? '/static/img/1.png' :item.img" class="user_img"></image>  <!-- 好友的头像 -->
					<view class="news_info">
						<view class="name">{{item.title}}</view>  <!-- 好友昵称 -->	
					</view>
				</view>        
			</listcell>                                              
		</block>
	</view>
</template>

<script>
import micon from '@/components/m-icon/m-icon';
import listcell from "@/components/list-cell/list-cell";
import storage from '@/api/storage.js';
import api from '@/api/api.js';
export default {
	components: {
		micon,
	    listcell
	},
	data() {
		return {
			list:[],   //最近聊天列表
			userEn:null,   //我的信息
			msg: null   //需要转发的消息
		}
	},
	onLoad(res) {
		this.userEn = storage.getMyInfo();  //获取我的信息
		this.getLastMsg();    //获取最近聊天列表
		this.msg = res.msg;   //获取需要转发的消息内容
	},
	methods:{
		//获取最近聊天列表
		getLastMsg(){
			api.getLastMsgByAccount({
				account: this.userEn.account,
				page: 1,
				count: 99
			}, res=>{
				let data = api.getData(res).data;
				this.list = data;
			})
		},
		//转发消息
		sendMsg(item){
			let _this = this;
			uni.showModal({
				title: "提示",
				content: "确定转发到：" + item.friendAccount + "？",
				success(res) {
					if (res.confirm) {
						api.sendMsgToFriend({
							account: _this.userEn.account,
							toAccount: item.friendAccount,
							type: 0,
							msg: _this.msg
						},res=>{
							let code = api.getCode(res);
							if(code == 0){
								uni.navigateBack({
									delta: 1
								})
							}
						})
					}
				}
			})
		}
	}
}
</script>

<style>
	.search_box{
		width:100%;
		position:relative;
		margin-top:40rpx;
		padding:0 20rpx;
		box-sizing:border-box;
	}
	.search_box>input{
		background:#f8f6f7;
		border-radius:15px;
		padding:10rpx 0 10rpx 100rpx;
	}
	.search_icon{
		position:absolute;
		top:6rpx;
		left:30rpx;
	}
	.test{
		background:#f8f6f7;
		padding:20rpx 0 20rpx 50rpx;
		margin-top:50rpx;
		color:#7d7b7c;
	}
	.news_left{
		display:flex;
		align-items: center;
	}
	.user_img{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		display: block;
		margin-right: 24upx;
	}
</style>
