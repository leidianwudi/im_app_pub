<template>
	<view class="content" @tap="hideDrawer" style="padding: 0rpx;padding-bottom: 100upx;box-sizing: border-box;background:#F1F2F7;">
		
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
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
				 <checkbox-group @change="getMsgId">
					<view class="tui-chat-content" v-for="(item, index) in arrMsg" :key="index" :id="'msg'+item.id">
							<view class="tui-chat-center" v-if="item.addTime">{{item.addTime}}</view>
							<view class="tui-chat-right" v-if="item.account == userEn.account"  @longpress="logoTime(item)">
								<label v-if="select">
								    <checkbox :value="item.id + ''" />
								</label>
								<view class="function" v-if="item.id == selectId">
									<view class="function_line" @tap="copy(item.msg)" v-if="isTest">复制</view>
									<view class="function_line" @tap="retransmission(item.msg)">转发</view>
									<view class="function_line">撤回</view>
									<view class="function_line" @tap="selectDel">多选</view>
									<view class="" @tap="delMsgsTrue(1, item.id)">删除</view>
								</view>
								<view class="function_arrow" v-if="item.id == selectId"></view>
								<!-- 我发送的消息 -->
								<view class="fail_box" v-if="item.change === 2"> <!-- 消息发送失败 -->
									<image src="/static/img/fail.png" mode="widthFix"></image>
								</view>
								<tui-loadmore :visible="true" v-if="item.change === 1" :index="2"></tui-loadmore>  <!-- 消息发送中 -->
								<!-- 普通文字内容 -->
								<rich-text v-if="item.msgType === 0" class="tui-chatbox tui-chatbox-right" :nodes="item.msg" style="word-break : break-all;"></rich-text>
								<!-- 我发送的图片 -->
								<view class="tui-chat-right" v-if="item.msgType === 1" @tap="revise(item.msg.url)">								
									<image :src="item.msg.url" mode="" :style="{'width': item.msg.w+'px','height': item.msg.h+'px'}"></image>
								</view>
								<!-- 我发送的语音 -->
								<view v-if="item.msgType === 2" class="tui-chatbox tui-chatbox-right tui-chat-right bubble voice" 
								@tap="playVoice(item)" :class="playMsgid == item.id?'play1':''" style="padding:10rpx 20rpx; font-size:14px;">
									<view class="length" style="margin-right:20rpx;">{{item.msg.length}}</view>
									<view class="icon my-voice"></view>
								</view>							
								<!-- 头像 -->
								<image :src="userEn.head" class="tui-user-pic tui-left"></image>
							</view>
								
							<view class="tui-chat-left" v-if="item.account != userEn.account" @longpress="logoTime(item)">
								<label v-if="select">
								    <checkbox :value="item.id + ''" />
								</label>
								<view class="function" v-if="item.id == selectId">
									<view class="function_line" @tap="copy(item.msg)" v-if="isTest">复制</view>
									<view class="function_line" @tap="retransmission(item.msg)">转发</view>
									<view class="function_line">撤回</view>
									<view class="function_line" @tap="selectDel">多选</view>
									<view class="" @tap="delMsgsTrue(1, item.id)">删除</view>
								</view>
								<view class="function_arrow left_arrow" v-if="item.id == selectId"></view>
								<!-- 好友发送的消息 -->
								<image :src="friendEn.friendHead" class="tui-user-pic tui-right" @tap="toFriendInfo(friendAccount)"></image>
								<rich-text v-if="item.msgType === 0" class="tui-chatbox tui-chatbox-left rich_text" :nodes="item.msg" style="word-break : break-all;"></rich-text>
								<view class="tui-chat-left-image" v-if="item.msgType === 1" @tap="revise(item.msg.url)">
									<!-- 好友发送的图片 -->
									<image :src="item.msg.url" mode="" :style="{'width': item.msg.w+'px','height': item.msg.h+'px'}"></image>
								</view>	
								<!-- 好友发送的语音 -->
								<view v-if="item.msgType === 2" class="tui-chatbox tui-chatbox-left tui-chat-right bubble voice" 
								@tap="playVoice(item)" :class="playMsgid == item.id?'play':''" style="padding:10rpx 20rpx; font-size:14px;">
									<view class="icon other-voice"></view>
									<view class="length" style="margin-left:20rpx;">{{item.msg.length}}</view>
								</view>		
							</view>										
					</view>
				</checkbox-group>
			</scroll-view>
		</view>
		<!-- 消息显示 -->
		
		<!-- 删除消息提示框 -->
		<modal :show="modal9" @cancel="hide9" :custom="true" :fadein="true">
			<view class="modal_custom">
				<view class="prompt_title">你确定要删除消息吗？</view>
				<view class="uni-padding-wrap radio_box">
					<label class="radio"><radio value="r1" :checked="delFriendMsg" @tap="isChecked" />是否同时删除对方的消息？</label>
				</view>
				<view class="button_box">
					<button @tap="hide9">取消</button>
					<button @tap="submitDel">确定</button>
				</view>
			</view>
		</modal>
		
		<!-- 多选删除底部的删除键 -->
		<view class="del_button" v-if="select">
			<button type="primary"  @tap="delMsgsTrue(2)">删除</button>
			<button type="primary" @tap="cancelDel">取消</button>
		</view>
		
		<!-- 抽屉 -->
        <view class="popup-layer" :class="popupLayerClass" @tap.stop.prevent="discard">
        	<!-- 表情 --> 
<!--       	<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
        		<swiper-item v-for="(page,pid) in emojiList" :key="pid">
        			<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
        				<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
        			</view>
        		</swiper-item>
        	</swiper> -->
			<emoji ref="emojiRef" :class="{hidden:hideEmoji}" @addEmoji="addEmoji"></emoji>
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<view class="box" @tap="shake"><view class="icon shake"></view></view>
					<!-- <view class="box" @tap.stop="handRedEnvelopes"><view class="icon hongbao"></view></view> -->
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
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->   <!-- 除了h5，其他平台都存在的代码 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->  <!-- 除了h5，其他平台都存在的代码 -->
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
import modal from "@/components/modal/modal";

export default {
		components: {
			tuiIcon,
			emoji,
			tuiLoadmore,
			modal
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
				selectId: 0,  //控制长按出现功能选择栏
				isTest: true,  //控制选择栏里是否有复制功能
				modal9: false,			//控制添加好友时的验证信息弹窗
				delFriendMsg: false,   //控制删除单选框
				select: false,  //控制删除多选框显示,
				delType: null, //判断删除记录类型 1：单选 2：多选
				delId: [], //被删除记录的id（多选用）
				delMsgId: null, //被删除记录的id（单选用）
				
				scrollAnimation: false,
				isHistoryLoading: false,
				page: 1,//当前第1页
				hideMore:true   	,// more参数
				emojiList: em.emojiList,
				
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
				
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null
			}
		},
		onLoad(res) {
			this.page = 1;
			this.userEn = storage.getMyInfo();
			this.friendAccount = res.friendAccount; //获取好友账号
			friendMsg.init(this, this.userEn.account, this.friendAccount); //初始化好友消息数据
			this.getFriendInfo(this.userEn.account, this.friendAccount); //查询特定好友详细信息
			friendMsg.getMsgList(); //获取与好友的消息记录
			this.$store.state.ws.addLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));
			//语音自然播放结束
			this.AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			// #endif
			console.log(this.arrMsg);
			
			setTimeout(() => {
				this.$refs.emojiRef.initData();//延迟加载表情
			}, 500);			
		},
		onUnload() {
			this.$store.state.ws.removeLister(wsType.friend_chat, this.onWebScoketMsg.bind(this));
			lastMsg.lastMsgRead2(0, this.friendAccount);
		},
		methods: {
			//抖屏功能
			shake(){
				// uni.navigateTo({
				// 	url: '/pages/friend/chat/shake/shake?friendAccount=' + this.friendAccount
				// })
				let _this = this;
				uni.showModal({
					title: '抖一抖',
					content: '确定对好友发起抖一抖？',
					success: function (res) {
					    if (res.confirm) {
							let txt = "发送抖一抖";
							//friendMsg.immediateAddMsg(txt, 3);  //将我的发言消息先添加到本地
							_this.hideDrawer();
					        friendMsg.sendShake(txt);							
					    }
					}
				});
			},
			//确定删除记录
			delMsg(){
				if(this.delFriendMsg){    	//选中同时删除对方的记录
					if(this.delType == 1){  //删除记录类型为单选
						friendMsg.delFriendMsgByArr(this.delMsgId);
					}else{  				//删除记录类型为多选（多选初始获取到的id值为string类型）
						let msgId = [];
						this.delId.forEach((item, index) => {
							let numId = parseInt(item);  //id转为number类型
						    msgId.push({
						        id: numId
						    });
						});
						friendMsg.delFriendMsgByArr(msgId);
						this.select = false;//关闭多选界面
					}
				}
				
				
				else{		//只删除自己的记录
					if(this.delType == 1){  //删除记录类型为单选
						friendMsg.delFriendMsgInAccount(this.delMsgId);
					}else{  				//删除记录类型为多选（多选初始获取到的id值为string类型）
						let msgId = [];
						this.delId.forEach((item, index) => {
							let numId = parseInt(item);  //id转为number类型
						    msgId.push({
						        id: numId
						    });
						});
						friendMsg.delFriendMsgInAccount(msgId);
						this.select = false;  //关闭多选界面
					}
				}
			},
			//多选删除记录操作
			getMsgId(v){
				this.delId = v.detail.value;
			},
			//删除记录确认弹窗控制
			delMsgsTrue(type, id){
				this.modal9 = true;
				if(type == 1){ 				  //删除记录类型为单选
					this.delMsgId = [{"id": id}];
					this.delType = 1;
				}
				if(type == 2) this.delType = 2;  //删除记录类型为多选
			},
			//取消多选删除按钮
			cancelDel(){
				this.select = false;				
			},
			//多选删除按钮
			selectDel(){
				this.select = true;
			},
			//单选转发跳转到转发界面
			retransmission(msg){
				let testMsg = msg.slice(5);
				testMsg = testMsg.substring(0,testMsg.length - 6); // 提取文字信息
				uni.navigateTo({
					url: "/pages/friend/retransmission/retransmission?msg=" + testMsg
				})
			},
			//控制删除功能弹窗的勾选框
			isChecked(){
				this.delFriendMsg = this.delFriendMsg == false ? true : false;
				console.log(this.delFriendMsg);
			},
			//关闭删除功能弹窗
			hide9() {
				this.modal9 = false
			},
			//提交删除记录信息
			submitDel(){
				this.modal9 = false
				this.delMsg();				
			},
			//复制功能
			copy(msg){
                let testMsg = msg.slice(5);
				testMsg = testMsg.substring(0,testMsg.length - 6); // 提取文字信息
				// console.log(testMsg);
				uni.setClipboardData({    //复制文字信息
				    data: testMsg,
				});
			},
			//长按打开功能菜单
			logoTime(item){
				this.isTest = item.msgType == 0 ? true : false;  //判断长按消息的类型 只有文字消息才显示复制
				this.selectId = item.id;
			},
			// 播放语音
			playVoice(msg){
				this.playMsgid=msg.id;
				this.AUDIO.src = msg.msg.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(参数为录音文件的临时路径)
			recordEnd(e){
				clearInterval(this.recordTimer);  //关闭录音动画
				if(!this.willStop){
					api.uploadFileToCache(e.tempFilePath, res=>{
						if(res.code == 0){
							let msg = {
								length: 0,  //录音总时长 
								url: res.data.url //录音文件路径
							}
							let min = parseInt(this.recordLength/60);
							let sec = this.recordLength%60;
							min = min<10?'0'+min:min;
							sec = sec<10?'0'+sec:sec;
							msg.length = min+':'+sec;
							let voiceInfo = tran.obj2Json(msg);  //录音信息转json格式	
							let content = "[voice]:" + voiceInfo; //添加录音标识		
							friendMsg.immediateAddMsg(msg, 2);  //将我的发言消息先添加到本地
							friendMsg.sendText(content);																
						}
					});
				}else{
					console.log('取消发送录音');
				}
				this.willStop = false;
			},
					
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			//预览图片
			revise(url){
				uni.previewImage({
					urls:[url]
				});
			},
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
												}
											});
										}else{											
											uni.showToast({
												title: "发送出错，请重试"
											})
										}
									})
								}
								uni.hideLoading();
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
			//发送语音消息
			sendVoice(){
				this.hideDrawer();//隐藏抽屉
				console.log('sendVoice');
			},
			//滚动条自动滚动到最后一行
			scrollToLast(){
				//h5要下针执行
				// #ifdef H5
				this.$nextTick(function() {
				// #endif
				
					let i = this.arrMsg.length - 1;
					if (i < 0) return;
					// 滚动到底
					this.scrollToView = 'msg' + this.arrMsg[i].id;
					
				// #ifdef H5
				});
				// #endif
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
				console.log("chooseEmoji:" + this.hideMore);
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
				console.log("sssssssssss");
				this.textMsg+=em.alt;
			},
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉(点击页面空白地方)
			hideDrawer(){
				this.selectId = 0;
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
				let Viewid = this.arrMsg[0].id;//记住第一个信息ID				
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
					this.scrollAnimation = true;//恢复滚动动画			
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

				//延迟100毫秒定位到最后一行，防止自己发消息后，还没定位到最后一行，消息临时id被改成正式id，导致定位错误
				setTimeout(() => {
					this.scrollToLast();
				}, 300);
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
		position:relative;
	}
	.tui-chat-right>label{
		position:absolute;
		z-index:999;
		left:0;
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
	.function{
		width:auto;
		position:absolute;
		top:-80rpx;
		border-radius:20rpx;
		background-color:rgba(48, 48, 48, .9);
		display:flex;
		justify-content:space-around;
		z-index:99;
	}
	.function>view{
		padding:25rpx;
		font-size:14px;
		color:#fff;
	}
	.function_line{
		border-right:1px solid #b5b5b5;
	}
	.function_arrow{
		width:0;
		height:0;
		border-right:16rpx solid transparent;
		border-left:16rpx solid transparent;
		border-top:16rpx solid rgba(48, 48, 48, .9);
		position:absolute;
		top:3px;
		right:17%;
		z-index:99;
	}
	.left_arrow{
		right:0;
		left:17%;
	}
	.prompt_title{
		margin-bottom:30rpx;
	}
	.radio_box{
		margin-bottom:30rpx;
		font-size:14px;
	}
	.button_box{
		width:100%;
		display:flex;
	}
	.button_box>button{
		width:50%;
		background:none;
		border-top:1px solid #dedede;
		border-radius:0;
	}
	.button_box>button:nth-child(1){
		border-right:1px solid #dedede;
	}
	.modal_custom{
		display:flex;
		justify-content:center;
		align-items:center;
		flex-direction:column;
	}
	.del_button{
		position:fixed;
		bottom:0;
		left:0;
		right:0;
		height:140rpx;
		background:#f8f6f7;
		z-index:1000;
		display:flex;
		justify-content:space-between;
		align-items:center;
	}
	.del_button>button{
		width:40%;
		height:70%;
	}
	.del_button>button:nth-child(1){
		background:#fe8282;
	}
	.del_button>button:nth-child(2){
		background:#fff;
		color:#000;
	}
	.my-voice, .other-voice{
		display:flex;
		align-items:center;
	}
@import "@/static/style/style.scss";
</style>
