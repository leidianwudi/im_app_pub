<template>
	<view class="content" @tap="hideDrawer" style="background: #ebedf6;padding: 0rpx;padding-bottom: 100upx;box-sizing: border-box;">
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap.stop="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode"  :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus"/>
					</view>
					<view class="em" @tap.stop="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more"  @tap.stop="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<!-- 消息显示 -->
		<view class="chat_info">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView"
			 @scrolltoupper="loadHistory" upper-threshold="50">
				 <view class="loading" v-if="isHistoryLoading">
						<view class="spinner">
							<view class="rect1"></view>
							<view class="rect2"></view>
							<view class="rect3"></view>
							<view class="rect4"></view>
							<view class="rect5"></view>
						</view>
				 </view>
					<view class="tui-chat-content" v-for="(item, index) in arrMsg" :key="index" :id="'msg'+item.id">
						<view class="tui-chat-center" v-if="item.addTime">{{item.addTime}}</view>
						<view class="tui-chat-right" v-if="item.account == userEn.account">
							<!-- 我发送的消息 -->
							<view class="fail_box" v-if="item.change === 2">  <!-- 消息发送失败 -->
								<image src="/static/img/fail.png" mode="widthFix"></image>
							</view>
							<tui-loadmore :visible="true" v-if="item.change === 1" :index="2"></tui-loadmore>  <!-- 消息发送中 -->
							<!-- 普通文字内容 -->
							<rich-text v-if="item.msgType === 0" class="tui-chatbox tui-chatbox-right" :nodes="item.msg" style="word-break : break-all;"></rich-text>
							<!-- 我发送的图片 -->
							<view class="tui-chat-right" v-if="item.msgType === 1">								
								<image :src="item.msg.url" mode="" :style="{'width': item.msg.w+'px','height': item.msg.h+'px'}"></image>
							</view>
							<!-- 头像 -->
							<image :src="userEn.head" class="tui-user-pic tui-left"></image>
						</view>

						<view class="tui-chat-left" v-if="item.account != userEn.account">
							<!-- 好友发送的消息 -->
							<image :src="friendEn.friendHead" class="tui-user-pic tui-right" @tap="toFriendInfo(friendAccount)"></image>
							<rich-text v-if="item.msgType === 0" class="tui-chatbox tui-chatbox-left rich_text" :nodes="item.msg" style="word-break : break-all;"></rich-text>
							<view class="tui-chat-left-image" v-if="item.msgType === 1">
								<!-- 好友发送的图片 -->
								<image :src="item.msg.url" mode="" :style="{'width': item.msg.w+'px','height': item.msg.h+'px'}"></image>
							</view>						
						</view>
					</view>
			</scroll-view>
		</view>
		<!-- 消息显示 -->
		
		<!-- 抽屉 -->
        <view class="popup-layer" :class="popupLayerClass" @touchstart.stop.prevent="discard">
        	<!-- 表情 --> 
<!--        	<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
        		<swiper-item v-for="(page,pid) in emojiList" :key="pid">
        			<view v-for="(em,eid) in page" :key="eid" @touchstart="addEmoji(em)">
        				<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
        			</view>
        		</swiper-item>
        	</swiper> -->
			<emoji :class="{hidden:hideEmoji}" @addEmoji="addEmoji"></emoji>
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @touchstart.stop="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @touchstart.stop="camera"><view class="icon paizhao"></view></view>
					<!-- <view class="box" @touchstart.stop="handRedEnvelopes"><view class="icon hongbao"></view></view> -->
				</view>
			</view>
        </view>
		
		<!-- 抽屉 -->
		
		<!-- 红包弹窗 -->
		<!-- <view class="windows" :class="windowsState"> -->
			<!-- 遮罩层 -->
<!-- 			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="/static/img/im/face/face_1.jpg"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import tuiIcon from '@/components/icon.vue';
import api from '@/api/api.js';
import storage from '@/api/storage.js';
import util from '@/common/util.js';
import wsType from '@/api/msgType.js';
import lastMsg from '@/api/lastMsg.js';
import emoji from '@/components/emoji/emoji';
import em from '@/common/em.js';
import tran from '@/common/tran.js';
import tuiLoadmore from "@/components/loadmore/loadmore";
import config from "@/static/app/config";
import friendMsg from '@/pages/friend/chat/friendChat/friendMsg.js';
import emojiStr from '@/common/emojiStr.js';

export default {
	
		components: {
			tuiIcon,
			emoji,
			tuiLoadmore
		},
		data() {
			return {
				friendAccount: "", //好友账号
				friendEn: '', //好友详细信息
				userEn: null, //我的详细信息
				textMsg: '', //发送内容
				arrMsg: [], //消息列表
				scrollToView: '', //滚动列表位置
				popupLayerClass:'', 	// 抽屉参数
				hideEmoji:true, 		//表情定义
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				scrollAnimation: false,
				isHistoryLoading: false,
				page: 1,
				hideMore:true   	,// more参数
				emojiList: em.emojiList
			}
		},
		onLoad(res) {
			this.userEn = storage.getMyInfo();
			this.friendAccount = res.friendAccount; //获取好友账号
			friendMsg.init(this, this.userEn.account, this.friendAccount); //初始化好友消息数据
			this.getFriendInfo(this.userEn.account, this.friendAccount); //查询特定好友详细信息
			friendMsg.getMsgList(); //获取与好友的消息记录
			this.$store.state.ws.addLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));
		},
		onUnload() {
			this.$store.state.ws.removeLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));
			lastMsg.lastMsgRead2(0, this.friendAccount);
		},
		methods: {
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			// 发送聊天图片
			getImage(type){
				this.hideDrawer();
				let _this = this;
				uni.showLoading({
                    title: '请稍等...',
					success() {
						uni.chooseImage({
							sourceType:[type],
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							success: (res)=>{
								for(let i=0; i<res.tempFilePaths.length; i++){
									api.uploadFileToCache(res.tempFilePaths[i], res=>{
										if(res.code == 0){
											uni.getImageInfo({
												src: res.data.url,
												success: (image)=>{
													let msg = {url:res.data.url, w:image.width, h:image.height};
													let imgInfo = _this.setPicSize(msg);   //重新设置图片大小													
                                                    _this.sendImgUrl(imgInfo);
													uni.hideLoading();													
												}
											});
										}else{
											uni.hideLoading();
											uni.showToast({
												title: "发送出错，请重试"
											})
										}
									})
								}
							},
						});
					}
				})
			},
			//更多功能(点击+弹出)
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				console.log(this.hideMore);
				if(this.hideMore){
					console.log(12);
					this.hideMore = false;
					this.openDrawer();
				}else{
					console.log(13);
					this.hideDrawer();
				}
			},
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText(){
				this.hideDrawer();//隐藏抽屉
				if(!this.textMsg){
					return;
				}
				let content = emojiStr.replaceEmoji(this.textMsg);  //替换表情符号
				friendMsg.immediateAddMsg(content, 0);  //将我的发言消息先添加到本地
				friendMsg.sendText(content);
				this.textMsg = '';//清空输入框
			},
			//滚动条自动滚动到最后一行
			scrollToLast(){
				this.$nextTick(function() {
					let i = this.arrMsg.length - 1;
					if (i < 0) return;
					// 滚动到底
					this.scrollToView = 'msg' + this.arrMsg[i].id;
				});
			},
			// 发送图片消息
			sendImgUrl(imgInfo){
				this.hideDrawer();//隐藏抽屉
				let content = tran.obj2Json(imgInfo);  //图片信息转json格式
				let msg = "[img]:" + content; //添加图片标识
				friendMsg.immediateAddMsg(imgInfo, 1);  //将我的发言消息先添加到本地
				friendMsg.sendText(msg);
			},
			// 聊天图片宽高处理
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em){
				this.textMsg+=em.alt;
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			// 上拉获取更多消息记录
			loadHistory(){
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				let Viewid = friendMsg.arrMsg[0].id;//记住第一个信息ID
				let _this = this;
				api.getFriendMsg({
					account: _this.userEn.account,
					toAccount: _this.friendAccount,
					id: 1,
					page: ++_this.page,
					count: 15
				}, res=>{
					this.isHistoryLoading = false;
					let newMsg = api.getPageList(res);
					newMsg.forEach(function(item){	
					   friendMsg.autoPushMsg(item, false);
					});					
				});
				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				this.$nextTick(function() {
					this.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
					this.$nextTick(function() {
						this.scrollAnimation = true;//恢复滚动动画
					});
				});				
			},
			//获取好友详细信息
			getFriendInfo(account, friendAccount) {
				api.getFriendByAccount({
					account: account,
					friendAccount: friendAccount
				}, res => {
					this.friendEn = api.getData(res);
					util.setBarTitle(this.friendEn.friendNickTip); //设置标题栏文字为好友的昵称
				})
			},
			//跳转到好友信息页面
			toFriendInfo(friendAccount) {
				uni.navigateTo({
					url: '/pages/friend/details/details?friendAccount=' + friendAccount + "&uiType=3"
				})
			},
			//监听webscoket返回的数据
			onWebScoketMsg(res) {	
				if((res.account != this.friendAccount) && (res.toAccount != this.friendAccount)) return;
				this.scrollAnimation = true;  //开启滑动动画
				console.log("onWebScoketMsg:"+ tran.obj2Json(res));
				friendMsg.autoPushMsg(res, true);
                this.scrollToLast();
			},
			discard(){
				return;
			}
		}
	}
</script>

<style lang="scss">

	page {
		background: #ebedf6;
	}

	//滚动条的scroll-into-view需要用到position: absolute;
	// .msg-list {
	// 	width: 100%;
	// 	position: absolute;
	// 	top: 0;
	// 	bottom: 100upx;
	// 	box-sizing: border-box;
	// 	background:#fff;
	// }

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

	.tui-pr {
		padding-right: 16rpx;
		box-sizing: border-box;
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
		width: 95%;
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
		align-items:center;
		padding-top: 30upx;
			justify-content: flex-start;
	}
	
	.tui-chat-left-image{
		display: flex;
		align-items:center;
		padding-top: 10upx;
		padding-left:30rpx;
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

	.chat_info {
		flex: 1;
	}

	.send_btn>button {
		width: 75rpx;
		height: 60rpx;
		font-size: 10px;
		padding: 0;
	}
	.fail_box{
		width:50rpx;
		height:50rpx;
		margin-right:20rpx;
	}
	.fail_box>image{
		width:100%;
		height:auto;
	}
@import "@/static/style/style.scss";
</style>
