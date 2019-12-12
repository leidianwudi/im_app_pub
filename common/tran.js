
//封装转换函数操作
module.exports = {
	//对象转JSON,支持数组
	obj2Json: function(obj){
		return JSON.stringify(obj);
	},
	//数组转字符串
	arr2Str: function(arr, sp){
		return arr.join(sp);
	},
	//字符串转数组
	str2Arr: function(arr, sp){
		return arr.split(sp);
	}
} 
