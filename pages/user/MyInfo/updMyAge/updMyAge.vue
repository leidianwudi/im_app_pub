<template>
	<view class="content">
		<view class="modify_box">
			<input type="text" v-model="val" />
			<picker :range="age" @change="ageChange">
			    {{ age[val] }} 
			</picker>
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
			value:'',
			age:[],
			type:''
			// six:['请选择性别','男', '女'],
			// sixIndex:0
		}
	},
	methods:{
		ageChange:function(e){
		    this.val = e.detail.value;
			this.value = e.detail.value;
		},
		Numadd(){
			for(let i=0;i<=100;i++)
			{
			    var num = i;
				this.age.push(num);
			}
		},
		apply(){
			if(this.val === ''){
				uni.showToast({
					title:"信息不能为空！",
					image:'/static/img/info-circle.png',
				})
			}else {
				var typeSp = this.type;
				let data = {};
				data["account"] = storage.getMyInfo().account;
				data[typeSp]= this.val;
                this.tijiao(data);
			}
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
			let account = storage.getMyInfo().account;
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
		this.Numadd();
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
	input{
		display:none;
	}
</style>
