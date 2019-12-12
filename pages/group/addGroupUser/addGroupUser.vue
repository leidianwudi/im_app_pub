<template>
	<view class="content">
		<scroll-view scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}" :show-scrollbar='false'>
			<view class="list">
				<block v-for="(item, index) in friengList" :key="index">
					<view class="cell_divider" :id="item.letter">
						{{item.letter}}
					</view>
					<checkbox-group @change="checkboxChange">
						<cell v-for="(item1,index2) in item.data" :key="index2" class="addUser">
							<view class="friend_info">
								<image :src="item1.friendHead" class="img"></image>
								<view class="name">{{item1.friendNickTip}}</view>
							</view>
							<label>
								<checkbox :value="item1.friendAccount" :checked="item1.ck" color="#19AC19" /></label>
						</cell>
					</checkbox-group>
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
	import storage from '@/api/storage.js'
	import cell from '@/components/list-cell/list-cell';
	import micon from '@/components/m-icon/m-icon';
	import tran from '@/common/tran.js';
	export default {
		components: {
			cell,
			micon
		},
		data() {
			return {
				friengList: [],
				userEn: null,
				groupEn:null,
				lists: [],
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // A字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
				ck: false,
				selectAccounts:[]  ,//所有的选中用户,
				whiteList:[]
			}
		},
		onLoad(res) {
			this.userEn = storage.getMyInfo();
			this.groupEn = storage.getGroupInfo();
			this.whiteList = tran.str2Arr(res.List, ",")
		},
		onShow() {
			this.friengList = [];
			let data = {
				account: this.userEn.account,
				page: 1,
				count: 20
			}
			this.reqFirendList(data);
			const that = this;
			setTimeout(() => {
				uni.getSystemInfo({
					success: function(res) {
						let winHeight = res.windowHeight; //获取设备的可使用窗口高度
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
		onNavigationBarButtonTap(e) {
			let accounts = 	tran.arr2Str(this.selectAccounts, "|");	
			let data = {
				groupId: this.groupEn.groupId,
				account: this.userEn.account,
				friendAccount: accounts
			}
			this.addGroupUser(data);
		},
		methods: {

			touchStart(e) { //点击首字母导航条时
				this.touchmove = true
				let pageY = e.touches[0].pageY //记录点击的首字母的pageY值
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
			touchEnd() { //点击首字母导航条结束时
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			reqFirendList(data) {
				let _this = this;
				api.getFriendByAccount(data, res => {
					let data = api.getData(res).data;
					data.forEach(function(uiFriend) {
						// 剔除已经在群内的好友
						let frAccount = [];
						frAccount.push(uiFriend.friendAccount);
						for(var i in _this.whiteList){
							for(var j in frAccount){
								if(_this.whiteList[i] === frAccount[j]){
								    return;
								}
							}
						}
						let fristKey = chinapy.makePy(uiFriend.friendNickTip);
						_this.addFriend(fristKey, uiFriend);
					});
				});
			},
			addFriend(fristKey, value) {
				//如果首字母不存在就添加首字母+添加数据
				if (!this.isFriendsHasKey(fristKey)) {
					let arr = {
						letter: fristKey,
						data: [value]
					};
					this.friengList.push(arr);
				} else { //如果首字母存在则追加数据
					let arr = this.getFriendsByKey(fristKey);
					arr.push(value);
				}
			},
			//根据首字母返回好友数组
			getFriendsByKey(key) {
				for (let value of this.friengList) {
					if (value.letter === key) {
						return value.data;
					}
				}
				return null;
			},
			//查询key是否存在
			isFriendsHasKey(key) {
				for (let value of this.friengList) {
					if (value.letter === key) {
						return true;
					}
				}
				return false;
			},
			//获取选中用户
			checkboxChange: function (e) {
				this.selectAccounts = e.detail.value;
			},
			addGroupUser(postData){
				api.friendJoinGroup(postData, res=>{
					let code = api.getCode(res);
					if(code === 0){
						uni.navigateBack({
							delta: 1
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
		overflow: hidden;
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

		margin-left: 30rpx;
		font-size: 30rpx;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
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

	.list {
		margin-top: 20rpx;
	}

	.friend_info {
		display: flex;
		align-items: center;
	}

	.addUser {
		display: flex;
		justify-content: space-between;
	}
</style>
