<template>
    <view class="content">
		<view class="user_info">
			<view class="img_box" @tap="revise">
				<image :src="userEn.head" class="user_img" mode="widthFix"></image>
			</view>  
			<view class="user_test" @tap="toMyInfo">
                <view class="user_nick">
                	<view class="user_nicheng">{{userEn.nick}}</view>
                	<view class="xiugai">
                		<image src="/static/img/xiugai.png" mode="widthFix"></image>
                	</view>
                </view>
				<view class="user_name">用户账号：{{userEn.account}}</view>
				<view class="user_text">{{userEn.signature ? userEn.signature : '暂无设置签名'}}</view>
			</view>
		</view>
        <view class="btn-row">
            <button v-if="!isLogin" type="primary" class="primary" @tap="bindLogin" hover-class="onbutton">登录</button>
            <button v-if="isLogin" type="default" @tap="bindLogout" hover-class="onbutton">退出登录</button>
        </view>
    </view>
</template>

<script>
import storage from '@/api/storage.js';
import utilCore from '@/api/utilCore.js';
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
		components: {},
		data(){
			return{
				id:1,
				userEn:null  ,//我的数据
				isLogin:false
			}
		},
		onShow(){
			this.userEn = storage.getMyInfo();
			this.isLogin = utilCore.isLogin();
		},
        methods: {	
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
                storage.outLogin();
                uni.reLaunch({
                    url: '../login/login'
                });
            },
			revise(){
				uni.previewImage({
					urls: [this.userEn.head],
				});
			},
			toMyInfo(){
				uni.navigateTo({
					url:'/pages/user/MyInfo/MyInfo'
				})
			}
        }
    }
</script>

<style>
    .btn-row>button{
		background:#1AAC19;
		color:rgb(255, 255, 255);
	}
	.user_info{
		width:100%;
		padding:15rpx 13rpx;
		box-sizing:border-box;
		display:flex;
		flex-direction:row;
	}
	.img_box{
		width: 200upx;
		height: 200upx;
		border-radius: 50%;
		display: block;
		margin-right: 50upx;
		overflow:hidden;
	}
	.user_img{
		width:100%;
		height:auto;
	}
	.user_test{
		flex:1;
		display:flex;
		flex-direction:column;
		align-items: flex-start;
		justify-content:space-between;
		padding-right:60rpx;
	}
	.user_nick{
		width:100%;
		display:flex;
		justify-content: space-between;
	}
	.user_nicheng{
		font-size:18px;
		font-weight:bolder;
	}
	.xiugai{
		width:41rpx;
		height:41rpx;
	}
	.xiugai>image{
		width:100%;
		height:auto;
	}
	.user_name{
		font-size:15px;
		color:#808080;
	}
	.user_text{
		font-size:16px;
	}
	.onbutton{
		opacity: 0.7;
	}
</style>
