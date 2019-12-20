<template>
	<view class="content">
		<image class="image" :src="path"></image>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="200" :maxHeight="200"></kps-image-cutter>
	</view>
</template>

<script>
import storage from '@/api/storage.js';
import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
import api from '@/api/api.js';
import util from '@/common/util.js';
	export default {
		components: {
			kpsImageCutter
		},
		data() {
			return {
				url: "", //本地获取到的文件路径
				path: "", //经过图片裁剪后的本地路径
				serverUrl: '' ,//文件在服务器上的地址
				userEn: null
			}
		},
		onShow() {
			this.userEn = storage.getMyInfo();
			util.setBarTitle('修改头像');
			uni.chooseImage({
				success: (res) => {
					// 设置url的值，显示控件
					this.url = res.tempFilePaths[0];
				}
			});
		},
		methods: {
			onok(ev) {
				let _this = this;
				uni.showLoading({
                    title:'正在上传头像.....',
					success() {
						_this.path = ev.path;
						api.uploadFileToCache(_this.url, res => {
							_this.serverUrl = res.data.url;
							api.updMyInfo({
								account: _this.userEn.account,
								head: _this.serverUrl
							}, res => {
								let code = api.getCode(res);
								if(code === 0){
									_this.url = "";
									uni.hideLoading();
									uni.navigateBack({
										delta: 1
									});
								} else{
									let msg = api.getMsg(res);  //取错误提示信息
									uni.showToast({
										title: msg,
										image:'/static/img/fail-circle.png',
										duration:2500
									});
									uni.navigateBack({
										delta: 1
									});
								}
							})
						});
					}
				});
			},
			oncancle() {
				// url设置为空，隐藏控件
				this.url = "";
			}
		}
	}
</script>

<style>

</style>
