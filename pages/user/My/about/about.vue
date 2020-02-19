<template>
	<view class="content" style="padding:0;">
		<view class="app_icon">
			<view class="logo">
				<image src="/static/img/im.png" class="logo_img" mode="widthFix"></image>
			</view>
		</view>
		<view class="app_info">
			<view class="app_name">im</view>
			<view class="app_edition">Version 1.0.0</view>			
		</view>		
		
		<view class="func">
			
			<view class="func_box">
		        <view class="">
		        	<text class="func_test">版本更新</text>
		        </view>
				<view class="">
					<micon type="arrowright" size=18></micon>
				</view>
			</view>						
		</view>
	</view>
</template>

<script>
import micon from '@/components/m-icon/m-icon';
export default{
	components: {
		micon
	}
}
</script>

<style>
	.app_icon{
		display:flex;
		justify-content: center;
		align-items:center;
		height:450rpx;
		width:100%;
	}
	.logo{
		width:250rpx;
		height:250rpx;
		border-radius:10px;
		overflow:hidden;
	}
	.logo_img{
		width:100%;
		height:100%;
	}
	.app_info{
		display:flex;
		flex-direction: column;
		justify-content:center;
		align-items:center;
	}
	.app_name{
		color:#000;
		font-size:24px;
		font-weight:bold;
	}
	.app_edition{
		color:#000;
		font-size:20px;		
	}
	.func{
		background:#fff;
		margin-top:100rpx;		
	}
	.func_box{
		border-bottom: 1px solid #F0F0F0;
		padding:20rpx 50rpx;
		display:flex;
		justify-content: space-between;
		align-items:center;
	}
	.func_test{
		margin-left:20rpx;
	}
</style>
