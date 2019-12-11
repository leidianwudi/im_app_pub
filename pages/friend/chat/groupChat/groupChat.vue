<template>
	<view class="content" style="background: #ebedf6;padding-bottom: 100upx;box-sizing: border-box;">
		<!-- 底部输入框 -->
		<view class="tui-operation tui-chat-operation">
			<view class='tui-right-flex tui-input-box'>
				<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-voice">
					<tui-icon name="voice" :size="34" color='#333'></tui-icon>
				</view>
				<input class="tui-chat-input" v-model="send_info" @confirm='send'></input>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150">
				<tui-icon name="imface" :size="26" color='#333'></tui-icon>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-pr">
				<tui-icon name="add" :ize="30" color='#333'></tui-icon>
			</view>
		</view>
		<!-- 底部输入框 -->
		
<!-- 		<view class="chat_info">
			<scroll-view scroll-y>
				<view class="tui-chat-content">
					<view class="tui-label">你们已成为好友</view> 
					<view class="tui-chat-center">星期四 11:02</view>  
					
					<view class="msgList" v-for="(item, index) in msgList" :key="index">
						
						<view class="tui-chat-right" v-if="item.Mymsg">  
							<view class="tui-chatbox tui-chatbox-right">{{item.Mymsg}}</view>
							<image :src="userEn.head" class="tui-user-pic tui-left"></image>
						</view>
						
						<view class="tui-chat-left" v-if="item.Frmsg">   
							<image :src="friendHead" class="tui-user-pic tui-right"></image>
							<view class="tui-chatbox tui-chatbox-left">{{item.Frmsg}}</view>
						</view>
						
					</view>
					
				</view>
			</scroll-view>
		</view> -->
		
	</view>
</template>

<script>
import tuiIcon from '@/components/icon.vue'
import api from '@/api/api.js';
import storage from '@/api/storage.js';
import util from '@/common/util.js';
export default {
		components:{
			tuiIcon
		},
		data() {
			return {
				send_info:'',
				groupEn:null
			}
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url:'/pages/group/checkGroup/checkGroup'
			})		
		},
		onLoad(){
			this.groupEn = storage.getGroupInfo();
			util.setBarTitle(this.groupEn.groupName);
		}
}
</script>

<style>
	page {
		background: #ebedf6;
	}

	.container {
		padding-left: 20upx;
		padding-right: 20upx;
		padding-bottom: 146upx;
		box-sizing: border-box;
	}

	/*--tabbar--*/

	.tui-operation {
		width: 100%;
		height: 100upx;
		overflow: hidden;
		background: #EFF2FC;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 999;
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0px;
		right: 0;
		left: 0;
		border-top: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-chat-operation {
		background: #f6f6f6 !important;
		/* padding-right: 18upx; */
		/* box-sizing: border-box; */
	}
	.tui-pr{
		padding-right: 16rpx;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-input-box {
		width: 78%;
		justify-content: flex-start;
	}

	.tui-chat-input {
		background: #fff;
		height: 72upx;
		border-radius: 6upx;
		padding-left: 20upx;
		padding-right: 20upx;
		flex: 1;
	}
	.tui-opcity {
		opacity: 0.5;
	}

	/*--tabbar--*/

	/*chatbox*/
	.tui-chat-content {
		width: 100%;
	}

	.tui-chatbox {
		max-width: 66%;
		border-radius: 10upx;
		position: relative;
		padding: 20upx 22upx;
		font-size: 32upx;
		color: #000;
		/* text-align: justify; */
		word-break: break-all;
		word-wrap: break-word;
	}

	.tui-chatbox::before {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		top: 20upx;
		border: 16upx solid;
	}

	.tui-chatbox-left {
		background: #fff;
		border: 1upx solid #fff;
		display: inline-block;
	}

	.tui-chatbox-left::before {
		right: 100%;
		border-color: transparent #fff transparent transparent;
	}

	.tui-chatbox-right {
		background: #a0d5f3;
		border: 1upx solid #a0d5f3;
	}

	.tui-chatbox-right::before {
		left: 100%;
		border-color: transparent transparent transparent #a0d5f3;
	}


	/*chatbox*/

	.tui-chat-left,
	.tui-chat-right {
		display: flex;
		align-items: flex-start;
		padding-top: 36upx;
	}

	.tui-user-pic {
		width: 80upx;
		height: 80upx;
		flex-shrink: 0;
		border-radius: 50%;
		display: block;
	}

	.tui-left {
		margin-left: 26upx;
	}

	.tui-right {
		margin-right: 26upx;
	}

	.tui-chat-right {
		justify-content: flex-end;
	}

	.tui-chat-center {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 28upx;
		font-size: 28upx;
		color: #666;
		padding-top: 36upx;
	}

	.tui-label {
		display: inline-block;
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		font-size: 24upx;
		line-height: 24upx;
		margin-top: 36upx;
		padding: 12upx 16upx;
		text-align: center;
		border-radius: 8upx;
		margin-left: 50%;
		transform: translateX(-50%);
	}

	.tui-img-chatbox {
		position: relative;
	}

	.tui-img-chatbox::after {
		content: '';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1upx solid #eaeef1;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		left: 0;
		top: 0;
		border-radius: 20upx;
	}

	.tui-chat-img {
		max-width: 200upx;
		/* min-height: 80upx; */
		display: block;
		border-radius: 10upx;
	}

	.tui-chat-flex {
		display: flex;
		align-items: center;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}

	.tui-chat-voice {
		width: 40upx;
		height: 40upx;
		display: block;
		flex-shrink: 0;
	}

	.tui-rotate {
		transform: rotate(180deg)
	}

	.tui-chat-fail {
		width: 50upx;
		height: 50upx;
		display: block;
		flex-shrink: 0;
	}

	.tui-mr {
		margin-right: 16upx;
	}

	.tui-ml {
		margin-left: 16upx;
	}

	.tui-flex-end {
		justify-content: flex-end;
	}

	.tui-flex-reverse {
		flex-direction: row-reverse;
	}
	.chat_info{
		flex:1;
	}
</style>
