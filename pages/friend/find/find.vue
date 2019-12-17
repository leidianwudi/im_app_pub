<template>
	<view class="content">
		<view class="cell_divider createG" @tap="myFind">
		    <view>
		    	<view class="myGroup">
		            <view class="adduser_img">
		            	<image src="/static/img/adduser.png" mode="widthFix"></image>
		            </view>
		    		<text>扫一扫</text>
		    	</view>
		    	<view class="more"><micon type="arrowright" size=18></micon></view>
		    </view>
		</view>
		
		<view class="cell_divider createG" @tap="myFind">
		    <view>
		    	<view class="myGroup">
		            <view class="adduser_img">
		            	<image src="/static/img/group.png" mode="widthFix"></image>
		            </view>
		    		<text>发现</text>
		    	</view>
		    	<view class="more"><micon type="arrowright" size=18></micon></view>
		    </view>
		</view>
	</view>
</template>

<script>
import micon from '@/components/m-icon/m-icon';
export default{
	components: {
		micon
	},
	methods:{
       myFind(){
		   uni.showToast({
		   	title: '正在开发中哦~'
		   });
	   }
	}
}
</script>

<style>
	.cell_divider {
		height: 66rpx;
		padding-left: 30rpx;
		font-size: 26rpx;
		color: #555;
		background: #f5f6fa;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
	}
	.createG{
		background:#fff;
		padding:50rpx 0;
		box-sizing:border-box;
		margin-bottom:20rpx;
	}
	.createG>view{
		width:100%;
		display:flex;
		justify-content:space-between;
		align-items: center;
		border-bottom:1px solid #F0F0F0;
	}
	.list{
		margin-top:20rpx;
	}
	.myGroup{
		display:flex;
		align-items:center;
		padding:10rpx 0;
	}
	.myGroup>text{
		margin-left:20rpx;
		color:#000000;
		font-size:14px;
		font-weight:normal;
	}
	.adduser_img{
		width:100rpx;
		height:100rpx;
	}
	.adduser_img>image{
		width:100%;
		height:auto;
	}
</style>
