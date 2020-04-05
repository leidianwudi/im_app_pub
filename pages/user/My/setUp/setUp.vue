<template>
	<view class="content" style="background-color: #F2F2F2; padding:0;">
		<view class="func">
			<view class="func_box">
		        <view class="">
		        	<text class="func_test">接收新消息通知</text>
		        </view>
				<view class="">
					<switch @change="isNotice" :checked="notice" color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box">
		        <view class="">
		        	<text class="func_test">声音</text>	
		        </view>			
				<view class="">
					<switch @change="isVoice" :checked="voice" color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box">
			    <view class="">
			    	<text class="func_test">震动</text>	
			    </view>			
				<view class="">
					<switch @change="isShake" :checked="shake" color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box" @tap="toNoticeNotExcuse">
			    <view class="">
			    	<text class="func_test">消息推送设置</text>	
			    </view>			
				<view class="">
				</view>
			</view>
			
			<view class="func_box">
			    <view class="">
			    	<text class="func_test">系统通知</text>	
			    </view>			
				<view class="">
				</view>
			</view>
						
		</view>
	</view>
</template>

<script>
import storage from '@/api/storage.js';
import api from '@/api/api.js';
	export default{
		data() {
			return {
				userEn: null  ,//我的数据
				notice: null,  //消息通知开关
				voice: null,  //声音开关
				shake: null  //震动开关
			}
		},
		methods:{
			//消息通知设置
			isNotice(e) {
				this.notice = e.detail.value;
				let noticeStatic = this.notice ? "1" : "0";
				this.setUserSetting("key_newMsgNotice", noticeStatic);
			},
			//声音设置
			isVoice(e) {
				this.voice = e.detail.value;
				let voiceStatic = this.voice ? "1" : "0";
				this.setUserSetting("key_noticeSound", voiceStatic);
			},
			//震动设置
			isShake(e) {
				this.shake = e.detail.value;
				let shakeStatic = this.shake ? "1" : "0";
				this.setUserSetting("key_noticeShake", shakeStatic);
			},
			//修改用户设置
			setUserSetting(k, v){
				let data = {
					account: this.userEn.account,
					key: k,
					val: v
				}
				api.setUserSetting(data,res=>{
					console.log(res);
				})
			},
			//查询用户系统设置
			getUserSetting(){
				api.getUserSetting({
					account: this.userEn.account,
					page: 1,
					count: 10
				},(res)=>{
					let code = api.getCode(res);
					if(code == 0){
						let data = api.getData(res).data;
						data.forEach((item, index)=>{
							switch (item.key){
								case "key_newMsgNotice":  //接收新消息通知
									this.notice = parseInt(item.val) == 0 ? false : true;
									break;
								case "key_noticeSound":  //声音设置
									this.voice = parseInt(item.val) == 0 ? false : true;
									break;
								case "key_noticeShake":  //震动设置
									this.shake = parseInt(item.val) == 0 ? false : true;
									break;
								default:
									break;
							}
						})
					}
				})
			},
			//跳转到消息推送设置页面
			toNoticeNotExcuse(){
				uni.navigateTo({
					url: "/pages/user/My/setUp/noticeNotExcuse/noticeNotExcuse"
				})
			}
		},
		onShow() {
			this.userEn = storage.getMyInfo();
			this.getUserSetting();
		}
	}
</script>

<style>	
	.func{
		margin-top:30rpx;		
	}
	.func_box{
		background:#fff;
		padding:40rpx 50rpx;
		display:flex;
		justify-content: space-between;
		align-items:center;
		margin-bottom:30rpx;
		border-radius:20px;
	}
	.func_test{
		color:#707070;
	}
</style>
