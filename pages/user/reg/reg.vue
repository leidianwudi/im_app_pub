<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row border">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
            </view>
			<view class="input-row border">
			    <text class="title">确认密码：</text>
			    <m-input type="password"  v-model="password1" placeholder="请输入密码"></m-input>
			</view>
            <view class="input-row">
                <text class="title">邮箱：</text>
                <m-input type="text" clearable v-model="email" placeholder="请输入邮箱"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button class="primary" @tap="register">注册</button>
        </view>
    </view>
</template>

<script>
	import api from '@/api/api.js';
	import util from '@/common/util.js';
    import mInput from '@/components/m-input.vue';
	import md5 from '@/common/md5.js'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                account: '',
                password: '',
				password1:'',
                email: ''
            }
        },
        methods: {
            register() {
                if (this.account.length < 5) {
                    uni.showToast({
							title: '新注册账号过短',
							image:'/static/img/fail-circle.png',
							duration:2500
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
							title: '新注册密码过短',
							image:'/static/img/fail-circle.png',
							duration:2500
                    });
                    return;
                }
				if(this.password1 !== this.password){
                    uni.showToast({
							title: '二次密码不一致',
							image:'/static/img/fail-circle.png',
							duration:2500
                    });
                    return;					
				}
                if (this.email.length < 3 || !~this.email.indexOf('@')) {
                    uni.showToast({
							title: '邮箱地址不合法',
							image:'/static/img/fail-circle.png',
							duration:2500
                    });
                    return;
                }
                const data = {
                    account: this.account,
                    pwd: md5(this.password),
                    email: this.email
                };
				this.onReg(data);
            },
			onReg(postData){
				api.userReg(postData, res =>{
					let code = api.getCode(res);
					if(code === 0){
						let data = api.getData(res);
						let msg = api.getMsg(res);
						uni.showToast({
							title: msg,
							image:'/static/img/check-circle.png',
							duration:2000,
							success() {
								setTimeout(function(){
									uni.reLaunch({
									    url: '../login/login',
									});
								},2000)
							}
						})
					}else{
						let msg = api.getMsg(res);  //取错误提示信息
						uni.showToast({
							title: msg,
							image:'/static/img/fail-circle.png',
							duration:2500
						})
					}
				})
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
		font-size:14px;
	}
	.btn-row>button{
	    background:#1AAC19;
		color:rgb(255, 255, 255);
	}
</style>
