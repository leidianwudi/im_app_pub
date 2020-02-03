<template>
	<view class="content" @tap="onMenuHide" style="padding:0;">
	    <block v-for="(item, index) in list" :key="index">
			<listcell :last="true" class="row"  @tap="onChat(item.type, item.friendAccount, item.groupId)">
				<view class="news_left">
					<image :src="item.type === 1 ? '/static/img/1.png' :item.img" mode="widthFix" class="user_img"></image>  <!-- 好友的头像 -->
					<view class="news_info">
						<view class="name">{{item.title}}</view>  <!-- 好友昵称 -->	
						<rich-text class="msg" :nodes="item.msg"></rich-text><!-- 好友发送的消息 -->
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
		  	<view class="addFriend" @tap="toAddFriend"><micon type="personadd" size=23></micon><text>添加好友</text></view>
			<view class="addFriend" @tap="toScanCode"><micon type="scan" size=20></micon><text>扫码发现</text></view>
			<view class="addFriend" @tap="toMyqrcode"><micon type="scan" size=20></micon><text>我的二维码</text></view>			
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
import lastMsg from "@/api/lastMsg.js";
import tran from '@/common/tran.js';
import newMsg from "@/pages/friend/news/newMsg.js";
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
			newMsg.initUi(this, this.userEn.account);  //初始化
		},
		onUnload() {
			newMsg.closeUi(); //ui关闭
		},
		onShow() {
			this.menu = false;
			newMsg.refreshLastMsg(); //刷新ui数据
			newMsg.getLastMsg();  //尝试取数据
		},
		// 右上角更多按钮的显示切换
		onNavigationBarButtonTap(){
		    this.menu = this.menu === true ? false : true;
		},
		methods:{
			//隐藏菜单
			onMenuHide(){
				this.menu = false;
			},
			//打开扫码
			toScanCode(){
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['qrCode'],
					success(res) {  
						// res.result是string类型。返回的数据是用户账号
						api.getUserByAccount({account: res.result}, res=>{
							let account = api.getData(res).account;
							uni.navigateTo({
								url:'/pages/friend/details/details?userAccount=' + account
							})
						})
					}
				})
			},
			//跳转到我的二维码名片界面
			toMyqrcode(){
				uni.navigateTo({
					url:'/pages/user/Myqrcode/Myqrcode'
				})
			},
			// 跳转到添加好友界面
			toAddFriend(){
				uni.navigateTo({
					url:'/pages/friend/newFriend/newFriend'
				})
			},
			//点击进入聊天界面
			onChat(type, friendAccount, groupId){

				if(this.menu === true) return;
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
			//下拉刷新重新请求聊天数据
			onPullDownRefresh(){
				newMsg.getLastMsg();
			},
		}
	}
</script>

<style>
	.menu{
		width:250rpx;
		height:auto;
		position:fixed;
		z-index:10;
		/* #ifndef H5 */
		top:30rpx;		
		/* #endif */
		/* #ifdef H5 */
		top:110rpx;		
		/* #endif */
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
		width:100%;
		height:120rpx;
		color: #FEFEFE;
		text-align:center;
		display:flex;
		align-items:center;
		font-size:14px;
		padding:0 20rpx;
		box-sizing:border-box;
	}
	.menu>view>text{
		margin-left:10rpx;
	}
	.menu>view:nth-child(3) text, .menu>view:nth-child(4) text{
		margin-bottom:3px;
	}
	.row{
		display:flex;
        flex-direction: row;
/* 		padding:10upx 15upx;
		box-sizing: border-box; */
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
		padding:0 4rpx;
		box-sizing: border-box;
		margin-top:20rpx;
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
