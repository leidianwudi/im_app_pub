<template>
	<view class="content" style="background:#EDEDED; padding:0;">
		<view class="group_user">
			<view class="user_model" v-for="(item, index) in groupUser" :key="index">
				<view class="">
					<image :src="item.head" mode="widthFix"></image>
				</view>
				<text>{{item.account}}</text>
			</view>
			<view class="user_model add_user">
				<image src="/static/img/add.png" mode="widthFix" @tap="addGroupUser"></image>
			</view>
		</view>
		<view class="group_info">
			<view class="group_bar">
                <view class="border_bottom">
                	<text>群聊名称</text>
                	<view class="group_name">
                		<text>{{group_name}}</text>
                	    <view><micon type="arrowright" size=18></micon></view>					
                	</view>
                </view>
			</view>
			<view class="group_bar">
				<view class="border_bottom">
					<text>群公告</text>
					<view class="group_name">
						<text>{{group_notice}}</text>
						<view><micon type="arrowright" size=18></micon></view>					
					</view>
				</view>
			</view>
		</view>
		
		<view class="out_group">
			<button type="primary" @tap="apply">退出群聊</button>			
		</view>
	</view>
</template>

<script>
import micon from '@/components/m-icon/m-icon';
import api from '@/api/api.js';
import storage from '@/api/storage.js';
export default {
	components:{
		micon
	},
	data() {
		return {
			group_name:'',
			group_notice:'',
			groupEn:null,
			groupUser:[],
			userEn: null
		}
	},
	onLoad() {
		this.groupEn = storage.getGroupInfo();
		this.userEn = storage.getMyInfo();
		this.group_name = this.groupEn.groupName;
	},
	onShow() {
		let data = {
			groupId: this.groupEn.groupId,
			account: this.userEn.account,
			page: 1,
			count: 20
		}
		this.getGroupUser(data);
	},
	methods:{
		getGroupUser(postData){
			let _this = this;
			api.getUserByGroupId(postData, res=>{
				let data = api.getData(res).data;
				this.groupUser = data;
			})
		},
		addGroupUser(){
			
		}
	}

}
</script>

<style>
	.group_user{
		margin-top:30rpx;
		margin-bottom:30rpx;
		display:flex;
		flex-wrap: wrap;
		justify-content:flex-start;
		background:#fff;
		padding:0 20rpx;
	}
	.user_model{
		width:20%;
		text-align:center;
		color:#A7A7A7;
		font-size:14px;
		margin-top:20rpx;
		margin-right:35rpx;
	}
	.user_model>view{
		width:100%;
		border-radius:13px;
		overflow:hidden;
	}
	.user_model image{
		width:100%;
		height:auto;
	}
	.user_model>text{
		display:block;
		width:100%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
    .group_info{
		width:100%;
		background:#fff;
	}
	.group_bar{
		padding:0 25rpx;
		box-sizing:border-box;
	}
	.border_bottom{
		width:100%;
		height:100%;
		border-bottom:1px solid #F2F2F2;
		display:flex;
		justify-content:space-between;
		padding:25rpx 0;
		box-sizing:border-box;
	}
	.group_name{
		display:flex;
	}
	.out_group{
		margin-top:70rpx;
	}
</style>


