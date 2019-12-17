<template>
	<view class="content">
		<view class="modify_box">
			<input type="text" v-model="groupName" />
		</view>
		<view class="modify_test">
			群名称
		</view>
		<view class="modify_box">
			<input type="text" v-model="notice" />
		</view>
		<view class="modify_test">
			群公告（可选填）
		</view>
		
		<view class="apply_friend">
			<button type="primary" @tap="apply">提交</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import util from '@/common/util.js';
import storage from '@/api/storage.js';
export default{
	data() {
		return {
			groupName:'',
			notice:'',
			userEn: null
		}
	},
	onShow() {
		this.userEn = storage.getMyInfo();
	},
	methods:{
		apply(){
			if(this.groupName === null || this.groupName === ''){
				uni.showToast({
					title:'群名称不能为空！',
					image:'/static/img/fail-circle.png',
					duration:2500,
					position:'center'
				})
				return
			} else{
				let data = {
					hostAccount: this.userEn.account,
					groupName: this.groupName,
					notice:this.notice
				}
				this.createG(data);
			}
		},
		createG(data){
			api.createGroup(data, res =>{
				let code = api.getCode(res);
				let msg = api.getMsg(res);
				if(code === 0){
					uni.showToast({
						title: msg,
						image:'@/static/img/check-circle.png.png',
						duration:2000,
						position:'center'
					})   
                    setTimeout(function(){
						uni.navigateBack({
							delta:1
						})
					},1500)
				}else{
					uni.showToast({
						title: msg,
						image:'@/static/img/fail-circle.png',
						duration:2000,
						position:'center'
					})
				}	
			})
		}
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
