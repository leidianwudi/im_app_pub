<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title login_info">账号：</text>
                <m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
            </view>
			
			
            <view class="input-row">
                <text class="title login_info">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
            </view>
        </view>
		
		<view class="input-group savePwdGroup">
			<view class="input-row savePwd">
			    <text class="title login_info text-df margin-right-sm">记住密码：</text>
			    <switch @change="SetShadow" :class="shadow?'checked':''" color="#39B54A"></switch>
			</view>
		</view>
		
        <view class="btn-row">
            <button class="primary" @tap="bindLogin" hover-class="onbutton">登录</button>
        </view>
		
		
        <view class="action-row">
            <navigator url="/pages/user/reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="/pages/user/updpwd/updpwd">忘记密码?</navigator>
        </view>
		
		
    </view>
</template>

<script>
	import storage from '@/api/storage.js';
	import api from '@/api/api.js';
	import util from '@/common/util.js';
	import md5 from '@/common/md5.js';
    import mInput from '@/components/m-input.vue'
    export default {
        components: {
            mInput
        },
        data() {
            return {
                account: '',   //输入的账号
                password: '',  //输入的密码
                positionTop: 0,
				shadow: false,
            }
        },
        methods: {   
			//控制勾选按钮
			SetShadow(e) {
				this.shadow = e.detail.value;
			},
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin() {				
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                let data = {
                    account: this.account,
                    pwd: md5(this.password)
                };
				this.onLogin(data);
            },  //bindLogin()
			//登录成功页面跳转到消息页面
            toMain(account) {
				this.$store.state.ws.setAccount(account);//连设置账户
				this.$store.state.ws.open();//开始连接ws服务器				
                uni.reLaunch({
                    url: '/pages/friend/news/news',
                });
            },  
			// 请求登录
			onLogin(postData){
				let _this = this;
				api.userLogin(postData, res => {
					let code = api.getCode(res);
					if(code === 0){
						let data = api.getData(res);
						storage.setMyInfo(data);
						if(_this.shadow){
							let userInfo = {
								userName: _this.account,
								password: _this.password
							}
							storage.setMyUserInfo(userInfo);
						}else storage.delMyUserInfo();
						this.toMain(data.account);   
					}else{
						let msg = api.getMsg(res);  //取错误提示信息
						uni.showToast({
							title: msg,
							image:'/static/img/fail-circle.png',
							duration:2500
						})
					}	
				});
			},
        },
        onReady() {
            this.initPosition();
        },
		onLoad() {
			if(!util.isEmpty(storage.getMyUserInfo())){
				this.account = storage.getMyUserInfo().userName;
				this.password = storage.getMyUserInfo().password; 
			}
		}
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
		font-size:15px;
    }
	.input-group{
		border-radius: 5px;
		border:1px solid #e3e3e3;
		color:rgba(0, 0, 0,.8);
		font-size:16px;
	}
	.btn-row>button{
	    background:#1AAC19;
	}
	.onbutton{
		opacity: 0.7;
	}
    .action-row navigator {
        color:#3981B2;
        padding: 0 20upx;
    }
    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .oauth-image {
        width: 100upx;
        height: 100upx;
        border: 1upx solid #dddddd;
        border-radius: 100upx;
        margin: 0 40upx;
        background-color: #ffffff;
    }
    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 20upx;
    }
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
		font-size:15px;
	}
	.input-group{
		border-radius: 5px;
		border:1px solid #e3e3e3;
		color:rgba(0, 0, 0,.8);
		font-size:14px;
	}
	.btn-row>button{
	    background:#1AAC19;
		color:rgb(255, 255, 255);
	}
	.savePwdGroup{
		margin-top:10rpx;
	}
	.savePwd{
		padding:10rpx 10rpx;
		display:flex;
		justify-content: space-between;
		align-items:center;
	}
</style>

