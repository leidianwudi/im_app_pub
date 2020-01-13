<template>
	<view class="content">
		<!-- 搜索框 -->
		<view class="searchbox">
			<input class="search_input" placeholder="搜索" :focus="true" v-model="search_msg"></input>
		</view>
		<!-- 查询出的好友列表 -->
		<view class="list" v-if="filterList.length > 0">
			<view class="test">联系人</view>
				<cell v-for="(item1,index2) in filterList" :key="index2" @tap="chat(item1.friendAccount)">
					<image :src="item1.friendHead" class="img"></image>
					<view class="name">{{item1.friendNickTip}}</view>
				</cell>
		</view>
		<!-- 无匹配数据时显示的盒子 -->
		<view class="list none" v-if="filterList.length <= 0">
			<view class="test"></view>
			<view class="result">
				暂无搜索结果
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import storage from '@/api/storage.js';
import cell from '@/components/list-cell/list-cell';
export default{
	components: {
		cell
	},
     data() {
     	return {
			friengList:[],  //好友列表
			search_msg: '', //搜索框输入的内容
			userEn: null, //我的信息
			result: true //控制搜索结果显示
     	}
     },
	 onLoad(){
		 this.userEn = storage.getMyInfo();
		 this.getMyFriendList();
	 },
	 methods:{
		// 获取全好友列表
        getMyFriendList(){
			let _this = this;
			api.getFriendsByAccount({
				account: this.userEn.account,
				page: 1,
				count: 999
			},res=>{
				let data = api.getPageList(res);
				data.forEach(function(item){
					_this.friengList.push(item);
				});
			})
		},
		//查看好友详细信息
		chat(friendAccount){
			uni.navigateTo({
				url:'/pages/friend/details/details?friendAccount=' + friendAccount + "&uiType=1"
			})
		},
	 },
	 computed:{
	 	filterList(){
	 		var arr = [];
	 		this.friengList.forEach((item) => arr.push(item));
	 		if (this.search_msg) {
	 			arr = this.friengList.filter(item => item.friendNickTip.includes(this.search_msg));
				console.log(11);
	 		}
	 		return arr;
	 	}
	}
}
</script>

<style>
	.searchbox {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-bottom:60rpx;
	}
	
	.search_input {
		display:block;
		width: 100%;
		height: 72rpx;
		background: #f5f6fa;
		border-radius: 36rpx;
		font-size: 30rpx;
		color: #a8abb8;
		text-align:center;
	}
	.list{
		margin-top:20rpx;
	}
	.none{
		text-align:center;
	}
	.test{
		width:100%;
		border-bottom:1px solid #e3e3e3;
		padding-left:20rpx;
		padding-bottom:10rpx;
		color:#808080;
	}
	.result{
		margin-top:20rpx;
		font-size:17px;
		color:#808080;
	}
	.cell_divider {
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
