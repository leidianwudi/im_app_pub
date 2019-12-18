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
			val: '',
			type: '',
			groupId: null,
			groupEn: null
		}
	},
	onLoad(res) {
		this.type = res.type;
		this.groupId = res.groupId;
	},
	onShow() {
		let _this = this;
	    api.getGroupById({id: this.groupId}, res=>{
			_this.groupEn = api.getData(res);
			if(this.type === 'groupName'){
				util.setBarTitle('修改群名称');
				_this.val = _this.groupEn.groupName;
			}else if(this.type === 'notice'){
				util.setBarTitle('修改群公告');
				_this.val = _this.groupEn.notice;
			}
		})	
	},
	methods:{
		apply(){
			if(this.val === ''){
				uni.showToast({
					title:"信息不能为空！",
					image:'/static/img/info-circle.png',
				})
			} else{
				let data = {};
				data["id"] = this.groupId;
				data["hostAccount"] = storage.getMyInfo().account;
				data[this.type] = this.val;
				this.apply1(data);
			}
		},
		apply1(postData){
			let _this = this;
			api.updGroupByHost(postData, res=>{
				let code = api.getCode(res);
				let msg = api.getMsg(res);
				if(code === 0){
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.showToast({
						title: msg,
						image:'/static/img/fail-circle.png',
						duration:2000
					})
				}
			})
		},
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
