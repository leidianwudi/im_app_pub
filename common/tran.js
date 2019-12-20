
//封装转换函数操作
module.exports = {
	//对象转JSON字符串,支持数组
	obj2Json: function(obj){
		return JSON.stringify(obj);
	},
	
	//JSON字符串转对象
	json2Obj: function(str){
		return JSON.parse(str);
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
