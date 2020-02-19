<template>
    <view class="content" style="background: #EDEDED; padding:0 0 20rpx;">
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
		
		<view class="func">
			
			<view class="func_box" @tap="toSetUp">
                <view class="">
                	<text class="iconfont myIcon">&#xe608;</text>
                	<text class="func_test">消息设置</text>
                </view>
				<view class="">
					<micon type="arrowright" size=18></micon>
				</view>
			</view>
			
			<view class="func_box" @tap="toAbout">
                <view class="">
                	<text class="iconfont myIcon">&#xe635;</text>
                	<text class="func_test">关于我们</text>	
                </view>			
				<view class="">
					<micon type="arrowright" size=18></micon>					
				</view>
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
import micon from '@/components/m-icon/m-icon';
import "@/static/style/iconFont/iconfont_my.css";
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
		components: {
			micon
		},
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
			toSetUp(){
				uni.navigateTo({
					url:'/pages/user/My/setUp/setUp'
				})
			},
			toAbout(){
				uni.navigateTo({
					url:'/pages/user/My/about/about'
				})
			},
			//退出登录
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
				this.$store.state.ws.close();  //关闭连接
                storage.outLogin(); //删除本地用户数据
				this.$store.state.ws.setAccount(''); //清空ws内的用户账号
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
		padding:30rpx;
		box-sizing:border-box;
		display:flex;
		flex-direction:row;
		background: #fff;
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
	.myIcon{
		font-size:28px;
		vertical-align:middle;
	}
	.func{
		background:#fff;
		margin-top:30rpx;		
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
