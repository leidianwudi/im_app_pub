import em from '@/common/em.js';
import config from '@/static/app/config.js';
module.exports = {
	emojiList: em.emojiList,
	//替换表情符号为图片
	replaceEmoji(str){
		let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
			console.log("item: " + item);
			for(let i=0; i<this.emojiList.length; ++i){
				let row = this.emojiList[i];
				for(let j=0; j<row.length; ++j){
					let EM = row[j];
					if(EM.alt==item){
						//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
						//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
						let onlinePath = config.BASE_URL + '/storage/emoji';
						let imgstr = '<img src="'+onlinePath+'/'+EM.url+'"></img>';
						console.log(imgstr);
						return imgstr;
					}
				}
			}
		});
		return '<div>'+replacedStr+'</div>';
	},
}
