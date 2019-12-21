<template>
	<view class="content" style="background: #ebedf6;padding-bottom: 100upx;box-sizing: border-box;">
		<!-- 底部输入框 -->
		<view class="tui-operation tui-chat-operation">
			<view class='tui-right-flex tui-input-box'>
				<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-voice">
					<tui-icon name="voice" :size="34" color='#333'></tui-icon>
				</view>
				<input class="tui-chat-input" v-model="send_info" @confirm='send' @input="onInput" @blur="isNFocal"></input>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150">
				<tui-icon name="imface" :size="26" color='#333'></tui-icon>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-pr" v-if="input">
				<tui-icon name="add" :ize="30" color='#333'></tui-icon>
			</view>
			<view class="tui-pr send_btn" hover-class="tui-opcity" :hover-stay-time="150" @tap="send" v-if="!input">
				<button type="primary">发送</button>
			</view>
		</view>
		<!-- 底部输入框 -->

		<view class="chat_info">
			<scroll-view class="msg-list" scroll-y="true" scroll-with-animation=false :scroll-into-view="scrollToView" :show-scrollbar="true">
				<view class="tui-chat-content" v-for="(item, index) in msgList" :key="index" :id="'msg'+item.id">
					<view class="tui-chat-right" v-if="item.Mymsg">
						<!-- 我发送的消息 -->
						<view class="tui-chatbox tui-chatbox-right">{{item.Mymsg}}</view>
						<image :src="userEn.head" class="tui-user-pic tui-left"></image>
					</view>

					<view class="tui-chat-left" v-if="item.Frmsg">
						<!-- 好友发送的消息 -->
						<image :src="friendEn.friendHead" class="tui-user-pic tui-right" @tap="toFriendInfo(item.account)"></image>
						<view class="tui-chatbox tui-chatbox-left">{{item.Frmsg}}</view>
					</view>

				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import tuiIcon from '@/components/icon.vue';
	import api from '@/api/api.js';
	import storage from '@/api/storage.js';
	import util from '@/common/util.js';
	import wsType from '@/api/msgType.js';
	export default {
		components: {
			tuiIcon
		},
		data() {
			return {
				friendAccount:"",  	//好友账号
				friendEn: '',      	//好友详细信息
				userEn: null,  		//我的详细信息
				send_info: '',  	//发送内容
				msgList: [],    	//消息列表
				scrollToView: '' 	,//滚动列表位置
				input: true     	//控制发送按钮显示
			}
		},
		onLoad(res) {
			this.userEn = storage.getMyInfo();
			this.friendAccount = res.friendAccount;  //获取好友账号
			this.getFriendInfo(this.userEn.account, this.friendAccount); //查询特定好友详细信息
			this.getMsgList();  //获取与好友的消息记录
			this.$store.state.ws.addLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));
		},
		onUnload(){
		    this.$store.state.ws.removeLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));	
		},
		methods: {
			isNFocal(){
				if(this.send_info === '') this.input = true;
			},
			//输入时显示发送按钮
			onInput(e){
				if(e.detail.value === '') this.input = true;
				else this.input = false;
			},
			//获取好友详细信息
			getFriendInfo(account, friendAccount){
				api.getFriendByAccount({account: account, friendAccount: friendAccount}, res=>{
						this.friendEn = api.getData(res);
						util.setBarTitle(this.friendEn.friendNickTip);  //设置标题栏文字为好友的昵称
					})
			},
			//跳转到好友信息页面
			toFriendInfo(friendAccount) {
				uni.navigateTo({
					url: '/pages/friend/details/details?friendAccount=' + friendAccount
				})
			},
			getMsgList() {
				let data = {
					account: this.userEn.account,
					toAccount: this.friendAccount,
					id: 0
				}
				this.getMsg(data);
			},
			getMsg(postData) {
				let _this = this;
				api.getFriendMsg(postData, res => {
					let data = api.getData(res).data.reverse();
					data.forEach(function(item) {
						_this.autoPushMsg(item, _this); //自动添加聊天数据
					})
					_this.$nextTick(function() {
						let i = _this.msgList.length - 1;
						if(i < 0) return;
						// 滚动到底
						_this.scrollToView = 'msg' + _this.msgList[i].id;
					});
				})
			},
			
			//自动添加消息数据
			autoPushMsg(item, _this){
				if (item.account === _this.userEn.account) {
					item.Mymsg = item.msg;
				} else {
					item.Frmsg = item.msg;
				}
				if(_this.isNewMsg(item.id, _this.msgList))
					_this.msgList.push(item);
			},
			
			//判断消息id是否是新消息
			isNewMsg(ids, msgList){
				if(util.isEmpty(msgList)) return true;
				let i = msgList.length - 1;
				return (ids > msgList[i].id);
			},

			//发送信息
			send() {
				if (this.send_info === '') return
				let data = {
					account: this.userEn.account,
					toAccount: this.friendAccount,
					type: 0,
					msg: this.send_info
				}
				this.sendInfo(data);
			},
			sendInfo(postData) {
				let _this = this;
				api.sendMsgToFriend(postData, res => {
					let code = api.getCode(res);
					let data = api.getData(res);
					if (code === 0) {
						_this.send_info = '';
					}
				})
			},
			//监听webscoket返回的数据
			onWebScoketMsg(res){
				console.log(res);
				this.autoPushMsg(res, this);
				this.$nextTick(function() {
					let i = this.msgList.length - 1;
					if(i < 0) return;
					// 滚动到底
					this.scrollToView = 'msg' + this.msgList[i].id;
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #ebedf6;
	}
	//滚动条的scroll-into-view需要用到position: absolute;
    .msg-list{
		width: 100%;
		position: absolute;
		top: 0;
		left:5rpx;
		bottom: 100upx;
		padding-left:20rpx;
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
		/* box-sizing: border-box; */
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
		align-items: flex-start;
		padding-top: 40upx;
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
	.send_btn>button{
		width:75rpx;
		height:60rpx;
		font-size:10px;
		padding:0;
	}
</style>