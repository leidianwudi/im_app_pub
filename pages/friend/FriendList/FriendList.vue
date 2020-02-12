<template>
	<view class="tui-page content" style="padding-right: 0;">
<!-- 		<view class="searchbox">
			<input class="search_input" @tap="search" placeholder="搜索"></input>
		</view> -->
<!--搜索框-->
	<scroll-view scroll-y :scroll-into-view="scrollViewId" :show-scrollbar='false' :style="{height:winHeight + 'px'}">
		<view class="cell_divider createG" @tap="myGroup">
	        <view>
	        	<view class="myGroup">
                    <view class="adduser_img">
                    	<image src="/static/img/group.png" mode="widthFix"></image>
                    </view>
	        		<text>我的群聊</text>
	        	</view>
	        </view>
		</view>
		
		<view class="cell_divider createG" @tap="newFriend">
		    <view>
		    	<view class="myGroup">
		    		<view class="adduser_img">
		    			<image src="/static/img/adduser.png" mode="widthFix"></image>
		    		</view>
		    		<text>新的朋友</text>
		    	</view>
		    </view>
		</view>
 <!--我的群聊-->
		<view class="list">
		    <block v-for="(item, index) in friengList" :key="index">
				<view class="cell_divider" :id="item.letter">
					{{item.letter}}
				</view>
				
				<cell v-for="(item1,index2) in item.data" :key="index2" @tap="chat(item1.friendAccount)">
					<image :src="item1.friendHead" class="img"></image>
					<view class="name">{{item1.friendNickTip}}</view>
				</cell>
			</block>
		</view>
<!--好友列表-->	
    </scroll-view>
	
	
	<view class="tui-indexed-list-bar" :style="{height:indexBarHeight+'px'}" @touchstart.stop="touchStart"
	 @touchmove.stop="touchMove" @touchend.stop="touchEnd" @touchcancel.stop="touchCancel">
		<view v-for="(items,index3) in lists" :key="index3" class="tui-indexed-list-text" :style="{height:indexBarItemHeight+'px'}">
			{{items.letter}}
		</view>
	</view>
	
	
	<view class="tui-indexed-list-alert" v-if="touchmove && lists[touchmoveIndex].letter">
		<text>{{lists[touchmoveIndex].letter}}</text>
	</view>	
	
	
	</view>
</template>

<script>
	import chinapy from '@/common/chinapy.js';
	import api from '@/api/api.js';
	import util from '@/common/util.js';
	import storage from '@/api/storage.js';
	import cell from '@/components/list-cell/list-cell';
	import micon from '@/components/m-icon/m-icon';
	export default {
		components: {
			cell,
			micon
		},
		data(){
			return{
				friengList:[],
				userEn: null,
                lists: [],
                touchmove: false, // 是否在索引表上滑动
                touchmoveIndex: -1,
                titleHeight: 0, // A字距离窗口顶部的高度
                indexBarHeight: 0, // 索引表高度
                indexBarItemHeight: 0, // 索引表子项的高度
                scrollViewId: '', // scroll-view滚动到的子元素的id
                winHeight: 0
			}
		},
		onLoad() {
			this.userEn = storage.getMyInfo();
		},
		onPullDownRefresh(){
			this.friengList = [];
			let data = {
				account: this.userEn.account,
				page: 1,
				count: 20
			};
			this.reqFirendList(data);
			const that = this;
			setTimeout(() => {
				uni.getSystemInfo({
					success: function(res) {
						let winHeight = res.windowHeight;  //获取设备的可使用窗口高度
						let barHeight = winHeight - uni.upx2px(232); //uni.upx2px 尺寸单位转换方法
						that.winHeight = winHeight;
						that.indexBarHeight = barHeight;
						that.indexBarItemHeight = barHeight / 25;
						that.titleHeight = uni.upx2px(132);
						that.lists = that.friengList;
					}
				})
			}, 10)
		},
		onShow(){
			let _this = this;
			this.friengList = [];
			let friendList = storage.getFriendList();
			if(util.isEmpty(friendList)){
				let data = {
					account: this.userEn.account,
					page: 1,
					count: 99
				}
				this.reqFirendList(data);
			}else{
				friendList.forEach(function(e){
					let fristKey = chinapy.makePy(e.friendNickTip);
					_this.addFriend(fristKey, e);
				});
			}
			const that = this;
			setTimeout(() => {
				uni.getSystemInfo({
					success: function(res) {
						let winHeight = res.windowHeight;  //获取设备的可使用窗口高度
						let barHeight = winHeight - uni.upx2px(232); //uni.upx2px 尺寸单位转换方法
						that.winHeight = winHeight;
						that.indexBarHeight = barHeight;
						that.indexBarItemHeight = barHeight / 25;
						that.titleHeight = uni.upx2px(132);
						that.lists = that.friengList;
					}
				})
			}, 10)
		},
		methods:{
			// 右上角查找好友按钮
			onNavigationBarButtonTap(){
			    uni.navigateTo({
			    	url:"/pages/friend/lookupFriend/lookupFriend"
			    })
			},
			chat(friendAccount){
				uni.navigateTo({
					url:'/pages/friend/details/details?friendAccount=' + friendAccount + "&uiType=1"
				})
			},
			myGroup(){
				uni.navigateTo({
				    url:'/pages/group/myGroup/myGroup'				
				})
			},
			newFriend(){
				uni.navigateTo({
				    url:'/pages/friend/newFriend/newFriend'				
				})				
			},
			touchStart(e) {  //点击首字母导航条时
				this.touchmove = true
				let pageY = e.touches[0].pageY   //记录点击的首字母的pageY值
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index
				}
			},
			touchMove(e) { //拖动首字母导航条时
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index
				}
			},
			touchEnd() {   //点击首字母导航条结束时
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			//获取好友列表
			reqFirendList(data){
				let _this = this;
				api.getFriendsByAccount(data, res=>{
					let data = api.getData(res).data;
					storage.setFriendList(data);
					data.forEach(function(e){				
						let fristKey = chinapy.makePy(e.friendNickTip);
						_this.addFriend(fristKey, e);
					});
				});
				uni.stopPullDownRefresh();
			},
			addFriend(fristKey, value){
				//如果首字母不存在就添加首字母+添加数据
				if(!this.isFriendsHasKey(fristKey)){
					let arr = {letter: fristKey, data: [value]};
					this.friengList.push(arr);
				} else{    //如果首字母存在则追加数据
					let arr = this.getFriendsByKey(fristKey);
					arr.push(value);
				}
			},
			//根据首字母返回好友数组
			getFriendsByKey(key){
				for(let value of this.friengList)
				{
					if(value.letter === key){
						return value.data;
					}
				}
				return null;
			},
			//查询key是否存在
			isFriendsHasKey(key){
				for(let value of this.friengList)
				{
					if(value.letter === key){
						return true;
					}
				}
				return false;
			}
		}
		
	}
</script>

<style>
	.more{
		margin-right:20rpx;
	}
	.content{
		height: 100%;
		overflow: hidden;
	}
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
    ::-webkit-scrollbar {
		  display: none;
				width: 0;
				height: 0;
				background-color: transparent;
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
	.tui-indexed-list-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 9999;
		position: absolute;
		top: 132rpx;
		right: 0;
		padding-right: 10rpx;
		width: 44rpx;
		color: #555;
		font-weight: bold;
	}
	
	.tui-indexed-list-text {
		font-size: 22rpx;
	}
	.tui-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 120rpx;
		height: 120rpx;
		right: 90rpx;
		top: 50%;
		margin-top: -60rpx;
		border-radius: 24rpx;
		font-size: 50rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.65);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
	}
	
	.tui-indexed-list-alert text {
		line-height: 50rpx;
	}
	.createG{
		background:#fff;
		padding:50rpx 0;
		box-sizing:border-box;
		margin-bottom:20rpx;
	}
	.createG>view{
		width:100%;
		display:flex;
		justify-content:space-between;
		align-items: center;
		border-bottom:1px solid #F0F0F0;
	}
	.createG>view:hover{}
	.createG>view:active{
		background: #f7f7f9 !important;
	}
	.list{
		margin-top:20rpx;
	}
	.myGroup{
		display:flex;
		align-items:center;
		padding:10rpx 0;
	}
	.myGroup>text{
		margin-left:20rpx;
		color:#000000;
		font-size:14px;
		font-weight:normal;
	}
	.adduser_img{
		width:100rpx;
		height:100rpx;
	}
	.adduser_img>image{
		width:100%;
		height:auto;
	}
</style>
