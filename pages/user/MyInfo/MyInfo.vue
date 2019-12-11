<template>
	<view class="content">
		<view class="header">
			<view class="header_img" @tap="updImg(head)">
				<image :src="userEn.head" mode="widthFix"></image>
			</view>
		</view>
		<view class="friend_info">
			<view>
				<text>账号</text>
				<view class="info_color">
					<text class="info_color name_style">{{userEn !== null ? userEn.account : ""}}</text>	
					<view class="more hide"><micon type="arrowright" size=18></micon></view>
				</view>
			</view>
			<view @tap="xiugai('nick', userEn.nick, '昵称')">
				<text>昵称</text>	
				<view class="info_color">
				    <text>{{userEn !== null ? userEn.nick : ''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>				
			</view>
			<view @tap="xiugai('signature', userEn.signature, '签名')">
				<text>签名</text>
				<view class="info_color">
					<text>{{userEn !== null ? userEn.signature : ''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>
			</view> 
			<view @tap="xiugai('tel', userEn.tel, '手机号码')">
				<text>手机号码</text>	
				<view class="info_color">
					<text>{{userEn !== null ? userEn.tel : ''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>
			</view>
			<view @tap="xiugai('email', userEn.email, '邮箱')">
				<text>邮箱</text>	
				<view class="info_color">
					<text>{{userEn !== null ? userEn.email : ''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>
			</view>
			<view @tap="xiugai('six', userEn.six, '性别')">
				<text>性别</text>
				<view class="info_color">
					<view v-if="userEn.six === 0" class="six_color">保密</view>
					<view v-if="userEn.six === 1" class="six_color">男</view>
					<view v-if="userEn.six === 2" class="six_color">女</view>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>
			</view>
			<view @tap="xiugai('age', userEn.age, '年龄')">
				<text>年龄</text>
				<view class="info_color">
					<text>{{userEn !== null ? userEn.age : ''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
				</view>
			</view>
			<view @tap="xiugai('address', userEn.address, '居住地')">
				<text>居住地</text>	
                <view class="info_color">
                	<text>{{userEn !== null?userEn.address:''}}</text>
					<view class="more"><micon type="arrowright" size=18></micon></view>
                </view>
			</view>
		</view>
		
		</view>
	</view>
</template>

<script>
import storage from '@/api/storage.js'
import api from '@/api/api.js';
import micon from '@/components/m-icon/m-icon'
export default {
	components:{
		micon
	},
		data(){
			return{
				userEn: null,
				// address:'this is address',
				// nick:'',
				// qq:'',
				// weiXin:'',
				// email:'',
				// tel:'',
				// signature:'',
				// nick:''
			}
		},
		onShow(){
			// uni.switchTab({
			// 	url:'/pages/friend/news/news.vue'
			// });
			this.userEn = storage.getMyInfo();
		},
		methods:{			
			result: function(e) {
				this.imageData = e.imgArr;
			},
			xiugai(type, value, title){
				if(type === 'age'){
					uni.navigateTo({
						url:"./updMyAge/updMyAge?type="+type+'&value='+value+'&title='+title
					});
					return;
				} if(type === 'six'){
					uni.navigateTo({
						url:"./updMySex/updMySex?type="+type+'&value='+value+'&title='+title
					});
					return;
				}
				uni.navigateTo({
					url:"./updMytext/updMytext?type="+type+'&value='+value+'&title='+title
				});
			}
			// updImg(type){
			// 	let _this = this;
			// 	uni.chooseImage({
			// 		count:1,
			// 		sourceType:['album'],
			// 		success(res) {
			// 			let imgUrl = res.tempFiles[0]; //.path.slice(5)
						
			// 			uni.saveFile({
			// 				tempFilePath:imgUrl,
			// 				success(res) {
			// 					console.log(res.savedFilePath);
			// 				}
			// 			})
			// 			// _this.userEn.head = imgUrl;
			// 			// console.log(imgUrl);
			// 		}
			// 	})
			// }
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.header{
		width:100%;
		height:350rpx;
		display:flex;
		justify-content: center;
		align-items:center;
		margin-bottom:20rpx;
	}
	.header_img{
		width:250rpx;
		height:250rpx;
		border-radius:50%;
		overflow:hidden;
	}
	.header_img>image{
		width:100%;
		height:auto;
	}
	.friend_info{
		width:100%;
		height:auto;
		padding:25rpx;
		box-sizing:border-box;
		margin-bottom:20rpx;
	}
	.friend_info>view{
		display:flex;
		justify-content:space-between;
		align-items:center;
		padding:30rpx 0;	
		border-bottom:1px solid #F3F3F3;
	}
	.friend_info>view>text:nth-child(1){
		font-size:18px;
	}
	.friend_info>view>text:nth-child(2){
		color: #717171;
		font-size:18px;
	}
	.modal_custom{
		text-align:center;
	}
	.prompt_title {
		padding-bottom: 20rpx;
		font-size: 34rpx;
	}
	.send_input {
		margin: 30rpx 40rpx;
		border-bottom: 1rpx solid #E6E6E6;
		padding-bottom: 20rpx;
		font-size: 32rpx;
	}
	.apply_friend{
		margin-bottom:50rpx;
	}
	.info_color{
		color:#999999;
		font-size:16px;
		display:flex;
	}
	.more{
		font-weight:bold;
		margin-left:10rpx;
	}
	.friend_info>view>text:nth-child(2){
		font-size:16px;
		color:#999999;
	}
	.hide{
		visibility:hidden;
	}
</style>
