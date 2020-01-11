<template>
	<view class="content" @tap="hideDrawer" style="background: #ebedf6; padding: 0rpx; padding-bottom: 100upx;box-sizing: border-box;">
		<!-- 底部输入框 -->
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
		<!-- 底部输入框 -->

		<view class="chat_info">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView"
			 @scrolltoupper="loadHistory" upper-threshold="50">
			 <!-- 加载历史数据waitingUI -->
				 <view class="loading" v-if="isHistoryLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				 </view>
				<view class="msgList" v-for="(item, index) in groupMsgList" :key="index" :id="'msg'+item.id">
					<view class="msg_main">
						<view class="tui-label" v-if="item.system">{{item.system}}</view>
						<!-- <view class="tui-chat-center">星期四 11:02</view> -->
						<view class="tui-chat-right" v-if="item.Mymsg">
							<rich-text class="tui-chatbox tui-chatbox-right" :nodes="item.Mymsg" style="word-break : break-all;"></rich-text>
							<image :src="item.head" class="tui-user-pic tui-left"></image>
						</view>

						<view class="tui-chat-left" v-if="item.Frmsg">
							<image :src="item.head" class="tui-user-pic tui-right" @tap="toGroupUserInfo(item.nickTip, item.job)"></image>
							<view class="chat_infos">
								<view class="msgbox">
									<text>{{item.account}}</text>
									<rich-text class="tui-chatbox tui-chatbox-left" :nodes="item.Frmsg" style="word-break : break-all;"></rich-text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
        <!-- 抽屉 -->
        <view class="popup-layer" :class="popupLayerClass" @touchstart.stop.prevent="discard">
        	<!-- 表情 --> 
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
	</view>
</template>

<script>
	import tuiIcon from '@/components/icon.vue'
	import api from '@/api/api.js';
	import storage from '@/api/storage.js';
	import util from '@/common/util.js';
	import wsType from '@/api/msgType.js';
	import em from '@/common/em.js';
	import lastMsg from '@/api/lastMsg.js';
	import emoji from '@/components/emoji/emoji';
	export default {
		components: {
			tuiIcon,
			emoji
		},
		data() {
			return {
				friendHead: '', //群用户头像
				textMsg: '', //输入框的内容
				groupId: null, //群id
				groupEn: null, //群的详细资料
				userEn: null, //我的详细资料
				groupMsgList: [], //群消息列表
				inputDisabled: false, //输入框是否禁用
				scrollToView: '', //滚动列表位置
				isHistoryLoading: false,
				scrollAnimation: false,
				page: 1,
				input: true ,//控制发送按钮显示
				emojiList: em.emojiList  ,//表情列表
				popupLayerClass:'', 	// 抽屉参数
				hideEmoji:true, 		//表情定义
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				hideMore:true   	,// more参数
				changeIndex: 0  //我的最新消息临时id
			}
		},
		//点击右上角的更多群信息
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/group/checkGroup/checkGroup?groupId=' + this.groupId
			})
		},
		onLoad(res) {
			this.userEn = storage.getMyInfo(); //获取我的详细信息
			this.groupId = parseInt(res.groupId); //保存群id
			this.getGroupMsg();
			api.groupIn({account: this.userEn.account, groupId: this.groupId});
			this.getGroupInfo();
			this.$store.state.ws.addLister(wsType.group_chat, this.onWebScoketGroupMsg.bind(this));			
		},
		onUnload() {
			this.$store.state.ws.removeLister(wsType.group_chat, this.onWebScoketGroupMsg.bind(this));
			lastMsg.lastMsgRead2(1, this.groupId);
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
													let jsonMsg = tran.obj2Json(imgInfo);  //图片信息转json格式
			                                        _this.sendImgUrl(jsonMsg);
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
				let content = this.replaceEmoji(this.textMsg);
				this.sendGroupMsg(content);
				this.textMsg = '';//清空输入框
			},
			// 发送图片消息
			sendImgUrl(content){
				this.hideDrawer();//隐藏抽屉
				this.sendGroupMsg("[img]:" + content);
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = '/static/img/emoji'
								let imgstr = '<img src="'+onlinePath+'/'+EM.url+'">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';;
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
            getGroupInfo(){
				let _this = this;
				//通过群id获取群的详细信息
				api.getGroupById({
					id: this.groupId
				}, res => {
					_this.groupEn = api.getData(res);
					util.setBarTitle(_this.groupEn.groupName);
				});
			},
			isNFocal() {
				if (this.textMsg === '') this.input = true;
			},
			//输入时显示发送按钮
			onInput(e) {
				if (e.detail.value === '') this.input = true;
				else this.input = false;
			},
			// 上拉获取更多消息记录
			loadHistory(){
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				let Viewid = this.groupMsgList[0].id;//记住第一个信息ID
				let _this = this;
				api.getGroupMsg({
					id: 1,
					groupId: _this.groupEn.id,
					account: _this.userEn.account,
					page: ++_this.page,
					count: 15
				}, res=>{
					this.isHistoryLoading = false;
					let newMsg = api.getPageList(res);
					newMsg.forEach(function(item){	
					   _this.autoPushGroupMsg(item, _this, false);
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
			//点击群成员头像跳转至个人信息页面
			toGroupUserInfo(friendAccount) {
				let uiType = this.groupEn.hostAccount == this.userEn.account ? 5 : 4;
				uni.navigateTo({
					url: '/pages/friend/details/details?friendAccount=' + friendAccount + "&uiType=" + uiType
				})
			},
			//获取群的聊天记录
			getGroupMsg() {
				let postData = {
					id: 1,
					groupId: this.groupId,
					account: this.userEn.account,
					page: this.page,
					count: 15
				}
				let _this = this;
				api.getGroupMsg(postData, res => {
					let code = api.getCode(res);
					let msg = api.getMsg(res);
					//群被解散时输入框禁用
					if (code === -10011) {
						_this.system = msg;
						_this.inputDisabled = true;
					} else {
						let data = api.getData(res).data.reverse(); //倒取群消息
						data.forEach(function(item) {
							_this.autoPushGroupMsg(item, _this, true);
						});
						_this.$nextTick(function() {
							let i = _this.groupMsgList.length - 1;
							if (i < 0) return;
							// 滚动到底
							_this.scrollToView = 'msg' + _this.groupMsgList[i].id;
						});
					}
				})
			},
			//自动获取群消息，isPush:true往后添加消息
			autoPushGroupMsg(item, _this, isPush) {
				if((_this.groupMsgList.length > 0) &&
				 (item.groupId != _this.groupMsgList[0].groupId)) return;
				 
				if (item.account === _this.userEn.account) {
					item.Mymsg = item.msg;
				} else if (item.account === '' || item.account === null) {
					item.system = item.msg;
				} else {
					item.Frmsg = item.msg;
				}
				if (_this.isNewMsg(item.id, _this.groupMsgList, isPush)){
					isPush ? _this.groupMsgList.push(item) : _this.groupMsgList.unshift(item);
				}
					
			},
			//判断消息id是否是新消息，isPush:true添加到后面，false添加到前面
			isNewMsg(ids, groupMsgList, isPush) {
				if(util.isEmpty(groupMsgList)) return true;
				if(isPush){
					let i = groupMsgList.length - 1;
					return (ids > groupMsgList[i].id);
				}else{
					return (ids < groupMsgList[0].id);
				}
			},
			//群内发送消息
			sendGroupMsg(content) {
				let data = {
					groupId: this.groupEn.id,
					account: this.userEn.account,
					type: 0,
					msg: content
				}
				this.sendMyMsg(data);
			},
			sendMyMsg(postData) {
				let _this = this;
				api.sendMsgToGroup(postData, res => {
					let code = api.getCode(res);
					let data = api.getData(res);
					if (code === 0) {
						_this.textMsg = '';
						//this.getGroupMsg();
					}
				})
			},
			//监听webscoket返回的数据
			onWebScoketGroupMsg(res) {
				this.scrollAnimation = true;  //开启滚动动画
				this.autoPushGroupMsg(res, this, true);
				this.$nextTick(function() {
					let i = this.groupMsgList.length - 1;
					if (i < 0) return;
					// 滚动到底
					this.scrollToView = 'msg' + this.groupMsgList[i].id;
				});
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

	.msg-list {
		width: 98%;
		position: absolute;
		top: 0;
		bottom: 100upx;
		display: flex;
	}

	.msg_main {
		flex: 1;
		padding-right: 20rpx;
		box-sizing:border-box;
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
		box-sizing: border-box;
	}

	.tui-pr {
		padding-right: 16rpx;
		box-sizing:border-box;
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
		border-radius: 10upx;
		position: relative;
		padding: 20upx 22upx;
		font-size: 32upx;
		color: #000;
		/* text-align: justify; */
		word-break: break-all;
		word-wrap: break-word;
	}

	.chat_infos {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
	}

	.msgbox {
		display: flex;
		flex-direction: column;
	}

	.msgbox>text {
		font-size: 13px;
		color: #A8A8A8;
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
		align-items: center;
		padding-top: 40upx;
		justify-content: flex-start;
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
@import "@/static/style/style.scss";
</style>
