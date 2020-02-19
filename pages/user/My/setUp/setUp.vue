<template>
	<view class="content" style="background-color: #F2F2F2; padding:0;">
		<view class="func">
			<view class="func_box">
		        <view class="">
		        	<text class="func_test">接收新消息通知</text>
		        </view>
				<view class="">
					<switch @change="isNotice" checked color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box">
		        <view class="">
		        	<text class="func_test">声音</text>	
		        </view>			
				<view class="">
					<switch @change="isVoice" checked color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box">
			    <view class="">
			    	<text class="func_test">震动</text>	
			    </view>			
				<view class="">
					<switch @change="isShake" checked color="#39B54A"></switch>
				</view>
			</view>
			
			<view class="func_box">
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
	export default{
		data() {
			return {
				notice: true,
				voice: true,
				shake: true
			}
		},
		methods:{
			isNotice(e) {
				this.notice = e.detail.value;
			},
			isVoice(e) {
				this.voice = e.detail.value;
			},
			isShake(e) {
				this.shake = e.detail.value;
			}
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
