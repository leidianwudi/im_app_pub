<script>
	import newMsg from "@/pages/friend/news/newMsg.js";
	import tran from "@/common/tran.js";
	export default {
		onLaunch: function() {					
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					//console.log('运行Android上') 
					//plus.navigator.closeSplashscreen();
					break;
				case 'ios':
					//console.log('运行iOS上') 
					//plus.navigator.closeSplashscreen();
					break;
				default:
					//console.log('运行在开发者工具上') 
					break;									
			}
			
			console.log('App Launch');
			this.$store.state.ws.init(); //初始化
			this.$store.state.ws.open(); //连接ws
			newMsg.init(this); //开启最后记录消息监听
			
			//#ifdef APP-PLUS					
			//收到推送消息执行
			const _handlePush = function(msg) {		
				// uni.showModal({
				// 	title:'resy',
				// 	content:msg.payload
				// }); 
				let res = tran.json2Obj(msg.payload);	
				console.log(res.type);
				console.log(res.account);
				if (res.type == 12)	//抖一抖
				{
					let fromAccount = res.account;	//来源好友
					//打开抖屏界面
					uni.navigateTo({
						url:'/pages/friend/chat/shake/shake?friendAccount='+ fromAccount
					});	
				}				
			};
			
			//监听系统通知栏消息点击事件  
			plus.push.addEventListener('click', function(msg){  
				_handlePush(msg);
			}, false);  
			//监听接收透传消息事件  
			plus.push.addEventListener('receive', function(msg){  
				plus.runtime.openURL("tlwlkjim://");//唤醒app
			    _handlePush(msg);
			}, false);			
			
			//#endif
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/app.css";

	/*每个页面公共css */
	page {
		min-height: 100%;
		display: flex;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* #ifdef MP-ALIPAY */
	page {
		min-height: 100vh;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		/* 		background-color:rgba(238,235,233,.3); */
		padding: 20upx;
		background: #fff;
		box-sizing: border-box;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.input-row .title {
		width: 30%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	.input-row .login_info {
		width: 20%;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}

	button.primary {
		background-color: #0faeff;
	}
</style>
