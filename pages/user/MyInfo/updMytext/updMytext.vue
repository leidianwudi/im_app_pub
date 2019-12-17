<template>
	<view class="content">
		<view class="modify_box">
			<input type="text" v-model="val" />
		</view>
		<view class="modify_test">
			请修改信息
		</view>
		
		<view class="apply_friend">
			<button type="primary" @tap="apply">提交</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import storage from '@/api/storage.js';
import util from '@/common/util.js';

export default{
	data() {
		return {
			val:'',
			type:'',
			userEn:null
		}
	},
	methods:{
		apply(){
			if(this.val === ''){
				uni.showToast({
					title:"信息不能为空！",
					image:'/static/img/info-circle.png',
				})
			}else {
                if(this.type === 'tel'){
					var re = /^1\d{10}$/
					  if (re.test(this.val)) {
					    this.apply1();
					  } else {
					    uni.showToast({
					      	title: '手机号格式错误',
					      	image:'/static/img/fail-circle.png',
					      	duration:2000
					    })
					  }
				} else if(this.type === 'email'){
					var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
					  if(re.test(this.val)){
					    this.apply1();
					  }else{
					    uni.showToast({
					      	title: '邮箱格式错误',
					      	image:'/static/img/fail-circle.png',
					      	duration:2000
					    })
					  }
				} else if(this.type === 'address'){
					var re=/[^\u4e00-\u9fa5]/;
					  if (!re.test(this.val)){
						  this.apply1();
					  } else{
						uni.showToast({
						  	title: '居住地错误',
						  	image:'/static/img/fail-circle.png',
						  	duration:2000
						})  
					  }
				} else{
					this.apply1();
				}
			}
		},
		apply1(){
			let data = {};
			data["account"] = storage.getMyInfo().account;
			data[this.type]= this.val;
			this.tijiao(data);
		},
		tijiao(postData){
			let _this = this;
			api.updMyInfo(postData, res => {
				let code = api.getCode(res);
				let msg = api.getMsg(res);
				if(code === 0){
					_this.updateMyInfo();
				}else{
					uni.showToast({
						title: msg,
						image:'/static/img/fail-circle.png',
						duration:2000
					})
				}
			})
		},
		updateMyInfo(){
			let account = this.userEn.account;
			api.getMyInfo({account:account}, res =>
			{
				let data = api.getData(res);
				storage.setMyInfo(data);
				uni.navigateBack();
			}			
			);
			
		}
	},
	onShow(){
		this.userEn = storage.getMyInfo();
	},
	onLoad(res){
		this.type = res.type;
		this.val = res.value;
		util.setBarTitle('修改' + res.title);
	}
}
</script>

<style>
	.modify_box{
		border-bottom: 1px solid #09BB07;
		width:90%;
		margin:0 auto;
		padding-top:50rpx;
		padding-left:15rpx;
		box-sizing:border-box;
	}
	.modify_test{
		color:#808080;
		font-size:14px;
		padding-left:30rpx;
		box-sizing:border-box;
		margin-top:10rpx;
	}
	.apply_friend{
		margin-top:100rpx;
	}
</style>
