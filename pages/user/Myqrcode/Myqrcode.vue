<template>
	<view class="content" style="background: #F7F7F7;">
        <view class="qrcode_main">
			<view class="user_info">
				<view class="user_img">
					<image :src="myimg" mode=""></image>
				</view>
				<text>{{myAccount}}</text>
			</view>
        	<view class="qrimg">
        		<view class="qrimg-i">
        			<tki-qrcode v-if="ifShow" cid="qrcode1" ref="qrcode" :val="val" :size="size" :unit="unit" :background="background" 
        			:foreground="foreground" :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" 
        			:loadMake="loadMake" :usingComponents="true" @result="qrR" />
        		</view>
        	</view>
<!--        	<view class="uni-padding-wrap">
        		<view class="btns">
        			<button type="primary" @tap="selectIcon">选择二维码图标</button>
        		</view>
        	</view> -->
			<view class="qrcode_test">
				<text>扫一扫二维码名片，加我为好友</text>
			</view>
        </view>
	</view>
</template>
<script>
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
import storage from '@/api/storage.js'
export default {
	data() {
		return {
			myimg: null,
			myAccount: '',
			ifShow: true,
			val: '', // 要生成的二维码值
			size: 500, // 二维码大小
			unit: 'upx', // 单位
			background: '#fff', // 背景色b4e9e2
			foreground: '#000', // 前景色309286
			pdground: '#000', // 角标色32dbc6
			icon: '', // 二维码图标
			iconsize: 40, // 二维码图标大小
			lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
			onval: false, // val值变化时自动重新生成二维码
			loadMake: true, // 组件加载完成后自动生成二维码
			src: '' ,// 二维码生成后的图片地址或base64
			userEn: null 
		}
	},
	onShow() {
		this.userEn = storage.getMyInfo();
		this.val = this.userEn.account;
		this.myimg = this.userEn.head;
		this.myAccount = this.userEn.account;
	},
	onReady(){
		this.creatQrcode();		
	},
	methods: {
		sliderchange(e) {
			this.size = e.detail.value
		},
		creatQrcode() {
			this.$refs.qrcode._makeCode()
		},
		saveQrcode() {
			this.$refs.qrcode._saveCode()
		},
		qrR(res) {
			this.src = res
		},
		clearQrcode() {
			this.$refs.qrcode._clearCode()
			this.val = ''
		},
		ifQrcode() {
			this.ifShow = !this.ifShow
		},
		selectIcon() {
			let that = this
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function (res) {
					that.icon = res.tempFilePaths[0]
					setTimeout(() => {
						that.creatQrcode()
					}, 100);
					// console.log(res.tempFilePaths);
				}
			});
		}
	},
	components: {
		tkiQrcode
	},
	onLoad: function () { },
}
</script>

<style>
/* @import "../../../common/icon.css"; */
.qrcode_test{
	color:#808080;
	font-size:14px;
	text-align:center;
	margin-top:30rpx;
}
.user_info{
	display:flex;
	align-items:center;
	margin-bottom:80rpx;
}
.user_img{
	width:100rpx;
	height:100rpx;
	border-radius:7px;
	overflow:hidden;
	margin-right:30rpx;
}
.user_img>image{
	width:100%;
	height:100%;
}
.user_info>text{
	font-size:16px;
}
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.qrcode_main{
	background:#fff;
	padding:40rpx 80rpx;
	box-sizing:border-box;
	position:fixed;
	top:50%;
	left:50%;
	transform:translate(-50%, -50%);
}
.qrimg {
	display: flex;
	justify-content: center;
}
.qrimg-i{
	margin-right: 10px;
}

slider {
	width: 100%;
}

input {
	width: 100%;
	margin-bottom: 20upx;
}

.btns {
	display: flex;
	flex-direction: column;
	width: 100%;
}

button {
	width: 100%;
	margin-top: 10upx;
}
</style>

