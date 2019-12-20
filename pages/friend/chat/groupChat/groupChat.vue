<template>
	<view class="content" style="background: #ebedf6;padding-bottom: 100upx;box-sizing: border-box;">
		<!-- 底部输入框 -->
		<view class="tui-operation tui-chat-operation">
			<view class='tui-right-flex tui-input-box'>
				<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-voice">
					<tui-icon name="voice" :size="34" color='#333'></tui-icon>
				</view>
				<input class="tui-chat-input" v-model="send_info" @confirm='sendGroupMsg' :disabled="inputDisabled"></input>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150">
				<tui-icon name="imface" :size="26" color='#333'></tui-icon>
			</view>
			<view hover-class="tui-opcity" :hover-stay-time="150" class="tui-pr">
				<tui-icon name="add" :ize="30" color='#333'></tui-icon>
			</view>
		</view>
		<!-- 底部输入框 -->
		
		<view class="chat_info">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView" 
			@scrolltoupper="loadHistory" upper-threshold="50">
					<view class="msgList" v-for="(item, index) in groupMsgList" :key="index" :id="'msg'+item.id">
                        <view class="msg_main">
                        	<view class="tui-label" v-if="item.system">{{item.system}}</view>
                        	<!-- <view class="tui-chat-center">星期四 11:02</view> -->
                        	<view class="tui-chat-right" v-if="item.Mymsg">  
                        		<view class="tui-chatbox tui-chatbox-right">{{item.Mymsg}}</view>
                        		<image :src="userEn.head" class="tui-user-pic tui-left"></image>
                        	</view>
							
                        	<view class="tui-chat-left" v-if="item.Frmsg"> 
                        		<image :src="friendHead" class="tui-user-pic tui-right" @tap="toGroupUserInfo(item.nickTip)"></image>
                        	    <view class="chat_infos">
                        	        <view class="msgbox">
                        	     		<text>{{item.account}}</text>
                        		        <view class="tui-chatbox tui-chatbox-left">{{item.Frmsg}}</view>
                        	     	</view>
                        	    </view>
                        	</view>
                        </view>
					</view>
			</scroll-view>
		</view>
		
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
				friendHead: '',  //群用户头像
				send_info: '',   //输入框的内容
				groupId: null,   //群id
				groupEn: null,  //群的详细资料
				userEn: null,  //我的详细资料
				groupMsgList: [],  //群消息列表
				inputDisabled: false  ,//输入框是否禁用
				scrollToView: '' 	,//滚动列表位置
				isHistoryLoading:false,
				scrollAnimation: false,
				page: 1
			}
		},
		//点击右上角的更多群信息
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'/pages/group/checkGroup/checkGroup?groupId=' + this.groupId
			})		
		},
		onLoad(res){
			this.userEn = storage.getMyInfo();  //获取我的详细信息
			this.groupId = parseInt(res.groupId);  		//保存群id
		},
		onShow() {
			let _this = this;
			//通过群id获取群的详细信息
			api.getGroupById({id: this.groupId}, res=>{
				_this.groupEn = api.getData(res);
				util.setBarTitle(_this.groupEn.groupName);
				let data = {
					id: 1,
					groupId: _this.groupEn.id,
					account: _this.userEn.account,
					page: _this.page,
					count: 15
				}
				_this.getGroupMsg(data);
			})
		},
		methods:{
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
					page: _this.page++,
					count: 15
				}, res=>{
					let newMsg = api.getData(res).data;
					console.log(newMsg);
					newMsg.forEach(function(item){
					   _this.groupMsgList.unshift(item);						
					})
				});
				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				this.$nextTick(function() {
					this.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
					this.$nextTick(function() {
						this.scrollAnimation = true;//恢复滚动动画
					});
				});
				this.isHistoryLoading = false;
			},
			//点击群成员头像跳转至个人信息页面
			toGroupUserInfo(friendAccount){
				uni.navigateTo({
					url:'/pages/friend/details/details?friendAccount=' + friendAccount
				})
			},
			//获取群的聊天记录
			getGroupMsg(postData){
				let _this = this;
				api.getGroupMsg(postData, res=>{
					let code = api.getCode(res);
					let msg = api.getMsg(res);
					//群被解散时输入框禁用
					if(code === -10011){
						_this.system = msg;
						_this.inputDisabled = true;
					}else {
						let data = api.getData(res).data.reverse(); //倒取群消息
						data.forEach(function(item){
							if(item.account === _this.userEn.account){
								item.Mymsg = item.msg;
							}else if(item.account === '' || item.account === null){
								item.system = item.msg;
							}else {
								item.Frmsg = item.msg;
							}
							_this.friendHead = item.head;
							if(_this.isNewMsg(item.id, _this.groupMsgList))
								_this.groupMsgList.push(item);
						});
						_this.$nextTick(function() {
							let i = _this.groupMsgList.length - 1;
							// 滚动到底
							_this.scrollToView = 'msg' + _this.groupMsgList[i].id;
						});
					}
				})
			},
			//判断消息id是否是新消息
			isNewMsg(ids, groupMsgList){
				if(util.isEmpty(groupMsgList)) return true;
				let i = groupMsgList.length - 1;
				return (ids > groupMsgList[i].id);
			},
			//群内发送消息
			sendGroupMsg(){
				let data = {
					groupId: this.groupEn.id,
					account: this.userEn.account,
					type: 0,
					msg: this.send_info
				}
				this.sendMyMsg(data);
			},
			sendMyMsg(postData){
				let _this = this;
				api.sendMsgToGroup(postData, res=>{
					let code = api.getCode(res);
					let data = api.getData(res);
					if(code === 0){
						_this.send_info = '';
						let data = {
							id: 1,
							groupId: this.groupEn.id,
							account: this.userEn.account,
							page: 1,
							count: 9
						}
						this.getGroupMsg(data);
					}
				})
			}
		}
}
</script>

<style>
	page {
		background: #ebedf6;
	}
	.msg-list{
		width: 98%;
		position: absolute;
		top: 0;
		bottom: 100upx;		
		display:flex;
	}
	.msg_main{
		flex:1;
	    padding-right:20rpx;
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
		border-radius: 10upx;
		position: relative;
		padding: 20upx 22upx;
		font-size: 32upx;
		color: #000;
		/* text-align: justify; */
		word-break: break-all;
		word-wrap: break-word;
	}
	.chat_infos{
		display:flex;
		flex-direction:row;
		justify-content:flex-start;
		width:100%;
	}
	.msgbox{
		display:flex;
		flex-direction: column;
	}
	.msgbox>text{
		font-size:13px;
		color:#A8A8A8;
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
		padding-top: 40upx;
		justify-content:flex-start;
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
