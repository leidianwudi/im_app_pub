<template>
	<view class="content">
	    <block v-for="(item, index) in list" :key="index">
			<listcell :last="true" class="row"  @tap="onChat(item.type, item.friendAccount, item.groupId)" style="padding-left:15upx;">
				<view class="news_left">
					<image :src="item.img" mode="widthFix" class="user_img"></image>  <!-- 好友的头像 -->
					<view class="news_info">
						<view class="name">{{item.title}}</view>  <!-- 好友昵称 -->
						<view class="msg">{{item.msg}}</view>	<!-- 好友发送的消息 -->			
					</view>
				</view>  
				
				<view class="news_right" :class="[item.level==3?'dot':'']" >  <!-- 如果item.level==3，class="tui-right-dot" 否则class为空 -->
					<view class="time">{{item.time}}</view>  <!-- 接收消息的时间 -->                                                <!-- msgNum：消息计数 -->
					<tui-badge :type="item.level==2?'gray':'danger'" :dot="item.level==3?true:false" v-if="item.msgNum>0">{{item.level!=3?item.msgNum:""}}</tui-badge>
				</view>       <!-- item.level==2时，显示灰色圆点   item.level==3时，显示小红圆点(不计算msgNum)   -->          <!-- item.level==3时，计数取消 -->       
			</listcell>       <!-- item.level==1时，显示红色圆点 -->                                               <!-- item.level==1并且msgNum为空值时，不显示任何圆点 -->
	    </block>
	  
		<view class="menu" v-if="menu">
			<text></text>
		  	<view class="addFriend" @tap="toAddFriend"><micon type="personadd-filled" size=20></micon><text>添加好友</text></view>
		</view>
	</view>
</template>

<script>
import tuiBadge from "@/components/badge/badge";
import listcell from "@/components/list-cell/list-cell";
import storage from '@/api/storage.js';
import api from '@/api/api.js';
import util from '@/common/util.js';
import micon from '@/components/m-icon/m-icon';
export default{
		components: {
			tuiBadge,
			listcell,
			micon
		},
		data(){
			return{
				list:[],
				userEn:null,
				menu:false
			}
		},
		onLoad() {
			this.userEn = storage.getMyInfo();
		},
		onShow() {
			this.menu = false;
			this.list = [];
			let data = {
				account: this.userEn.account,
				page: 1,
				count: 6
			}
			this.getMsgList(data);
		},
		// 右上角更多按钮的显示切换
		onNavigationBarButtonTap(){
		    this.menu = this.menu === true ? false : true;
		},
		methods:{
			toAddFriend(){
				uni.navigateTo({
					url:'/pages/friend/newFriend/newFriend'
				})
			},
			onChat(type, friendAccount, groupId){
				switch (type){
					case 0:  //好友聊天
						uni.navigateTo({
							url:'/pages/friend/chat/friendChat/friendChat?friendAccount='+ friendAccount
						});					
						break;
					case 1:  //群聊天
						uni.navigateTo({
							url:'/pages/friend/chat/groupChat/groupChat?groupId='+ groupId
						});
						break;
					default:
						break;
				}
			},
			getMsgList(postData){
				let _this = this;
				api.getLastMsgByAccount(postData, res=>{
					let data = api.getData(res).data;
					storage.setLastMsgIndex(data);
					if (util.isEmpty(data)) return;
					data.forEach(function(item){
						if(item.type === 0){
							if(item.sendAccount === _this.userEn.account){
							    item.level = 0;
								item.msgNum = '';
							} else{
								item.level = 1;
								item.msgNum = item.msgIndex;
							}
							api.getFriendByAccount({
								account: _this.userEn.account,
								friendAccount: item.title
							}, res=>{
								let data = api.getData(res);
								item.title = data.friendNickTip !== '' ? data.friendNickTip : item.title;
							});
						}else{
							item.level = 1;
							item.msgNum = item.msgIndex;	
							item.img = '/static/img/1.png';
						}
						let timer = item.updTime.split(" ");
						timer = timer[1].slice(0, timer.length-5)
						item.time = timer;
						_this.list.push(item);
					})
				});
				uni.stopPullDownRefresh();
			},
			onPullDownRefresh(){
				this.list = [];
				let data = {
					account: this.userEn.account,
					page: 1,
					count: 6
				}
				this.getMsgList(data);
			}
		}
	}
</script>

<style>
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
	}
	.row{
		display:flex;
        flex-direction: row;
		padding:10upx 15upx;
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
	.news_info {
		max-width: 500upx;
		min-height: 80upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 34upx;
		line-height: 1;
		color: #262b3a;
	}
	.msg {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 28upx;
		line-height: 1;
		color: #9397a4;
		padding:10rpx 4rpx;
	}
	.news_right {
		max-width: 120upx;
		height: 88upx;
		margin-left: auto;
		text-align: right;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}
	.news_right.dot {
		height: 76upx;
		padding-bottom: 10upx;
	}
	.time {
		width: 100%;
		font-size: 24upx;
		line-height: 24upx;
		color: #9397a4;
	}
	.tui-badge {
		width: auto
	}
</style>
