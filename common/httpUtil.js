import config from '@/static/app/config.js';

//http操作工具类
module.exports = {
	//进行http的post请求
	post : function(url, postData, funSuccess) {
		uni.request({
			url: config.BASE_URL + '/api/' + url,
			method: 'post',
			dataType: 'json',
			data: postData,
			success: funSuccess,
		});
	}
} 
