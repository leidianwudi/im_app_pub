<template>
	<view class="content">
		<view class="setting">
			<view class="tips">
				推送消息免打扰
			</view>
			<radio-group @change="radioChange">
				<view class="setting_box">
					<text>开启</text>
					<view class="info_color">
						<view class="more hide">
							<label class="radio"><radio value="1" :checked="noticeSetting == 1" /></label>
						</view>
					</view>
				</view>
				
				<view class="setting_box">
					<text>只在夜间开启(22:00 - 7:00)</text>
					<view class="info_color">
						<view class="more hide">
							<label class="radio"><radio value="2" :checked="noticeSetting == 2" /></label>
						</view>
					</view>
				</view>
				
				<view class="setting_box">
					<text>关闭</text>
					<view class="info_color">
						<view class="more hide">
							<label class="radio"><radio value="0" :checked="noticeSetting == 0" /></label>
						</view>
					</view>
				</view>
			</radio-group>
		</view>
	</view>
</template>

<script>
import storage from '@/api/storage.js';
import api from '@/api/api.js';
export default{
	data() {
		return {
			userEn: null  ,//我的数据
			noticeSetting: null //单选框
		}
	},
	methods:{
		//单选框
		radioChange(e){
			this.noticeSetting = e.detail.value;
		},
		// 右上角保存按钮
		onNavigationBarButtonTap(){
		    api.setUserSetting({
				account: this.userEn.account,
				key: "key_noticeNotExcuse",
				val: this.noticeSetting
			},res=>{
		    	let code = api.getCode(res);
				if(code == 0){
					uni.navigateBack({
						delta: 1
					})
				}
		    })
		    
		},
		//查询用户系统设置
		getUserSetting(){
			api.getUserSetting({
				account: this.userEn.account,
				page: 1,
				count: 10
			},(res)=>{
				let code = api.getCode(res);
				if(code == 0){
					let data = api.getData(res).data;
					data.forEach((item, index)=>{
						if(item.key == "key_noticeNotExcuse"){
							this.noticeSetting = item.val;
						}
					})
				}
			})
		}
	},
	onShow() {
		this.userEn = storage.getMyInfo();	
		this.getUserSetting();
	}
}
</script>

<style>
	.setting{
		width: 100%;
		height: auto;
		padding: 25rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}
	.setting_box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1px solid #F3F3F3;
	}
	.info_color {
		color: #999999;
		font-size: 16px;
		display: flex;
		align-items:center;
	}
	.tips{
		color:#6A6B6B;
		margin-bottom:20rpx;
	}
</style>
