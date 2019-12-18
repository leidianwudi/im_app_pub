<template>
	<view class="content">
		<view class="cell_divider createG" @tap="createGroup">
			<text>创建群聊</text>
			<view><micon type="forward" size=18></micon></view>
		</view>
		
		<view class="list">
		    <block v-for="(item, index) in groupList" :key="index">
				<cell @tap="goGroupChat(item.groupId)">
					<image src="/static/img/2.jpg" class="img"></image>
					<view class="name">{{item.groupName}}</view>
				</cell>
			</block>
		</view>
	</view>
</template>

<script>
import micon from '@/components/m-icon/m-icon';
import cell from '@/components/list-cell/list-cell';
import storage from '@/api/storage.js';
import api from '@/api/api.js';
export default{
	components: {
		micon,
		cell
	},
	onShow() {
		this.groupList = [];
		this.userEn = storage.getMyInfo();
	    let data = {
			account: this.userEn.account,
			page: 1,
			count: 10
		}	
		this.reqMyGroupList(data);
	},
	data() {
		return {
			userEn: null,
			groupList:[]
		}
	},
	methods:{
		goGroupChat(groupId){
			uni.navigateTo({
				url:'/pages/friend/chat/groupChat/groupChat?groupId=' + groupId
			})
		},
		reqMyGroupList(postData){
			let _this = this;
			api.getGroupByAccount(postData, res=>{
				let data = api.getData(res).data;
				_this.groupList = data;
			})
		},
		createGroup(){
			uni.navigateTo({
		        url:'/pages/group/createGroup/createGroup'					
			})
		}
	}
}
</script>

<style>
	.cell_divider {
		margin-top:60rpx;
		height: 66rpx;
		padding-left: 30rpx;
		font-size: 26rpx;
		color: #555;
		background: #f5f6fa;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
	}
    .createG{
    	display:flex;
    	justify-content:space-between;
    	align-items: center;
    }	
	.list{
		margin-top:20rpx;
	}
	.img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.name {
		width: 80%;
		padding-left: 30rpx;
		font-size: 30rpx;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
