import config from '@/static/app/config.js';
import tran from '@/common/tran.js';

//http操作工具类
module.exports = {
	//进行http的post请求
	post: function(url, postData, funSuccess) {
		uni.request({
			url: config.BASE_URL + '/api/' + url,
			method: 'post',
			dataType: 'json',
			data: postData,
			success: funSuccess
		});
		// uni.showModal({
		//     title: '提示',
		//     content: '登录已经失效,请重新登录',
		// 	showCancel: false,	//不要取消对话框
		//     success: function (res) {
		//         if (res.confirm) {
		//             console.log('用户点击确定');
		//         } else if (res.cancel) {
		//             console.log('用户点击取消');
		//         }
		//     }
		// });
	},
 
	//上传文件  url:服务器地址 path:本地文件路径 name:上传文件名称 funSuccess:成功时的回调函数
	upload: function(url, path, name, funSuccess) {
		uni.uploadFile({
			url: config.BASE_URL + '/api/' + url, //文件上传地址
			filePath: path,
			name: name,
			success: (res) => {
				let data = tran.json2Obj(res.data);
				funSuccess(data);
			}
		});
	}
}
