<template>
	<view class="content">
			<view class="searchbox">
				<input class="search_input" placeholder="搜索用户" v-model="info" type="text" confirm-type="search" @confirm="Send"></input>
				<view class="current_box">
					<image src="/static/img/current.png" mode="widthFix" class="current"></image>
				</view>
			</view>
			<!-- 		                    搜索框                         -->			
            <view>
            	<cell :last="true" row v-if="search_box ===1">
            	    <view class="news_left">
            	    	<view class="search_img">
            	    		<image :src="search_img" mode="widthFix"></image>
            	    	</view>
            	    	<view class="cell_name">{{search_name}}</view>
            	    </view>			
            		<view class="news_right"> 
            	        <button type="primary" class="Friend_btn" @tap="Apply">加好友</button>
            		</view>
            	</cell>
				<cell :last="true" @click="detail" row v-if="search_box === 0" class="empty">
					<text>该用户不存在</text>
				</cell>
            	<cell :last="true" row v-if="search_box ===2">
            	    <view class="news_left">
            	    	<view class="search_img">
            	    		<image :src="search_img" mode="widthFix"></image>
            	    	</view>
            	    	<view class="cell_name">{{search_name}}</view>
            	    </view>			
            		<view class="news_right"> 
            	        <text>自己</text>
            		</view>
            	</cell>
            </view>
			<!-- 		                    搜索结果                         -->
		<scroll-view scroll-y :show-scrollbar='true'>
            <view class="newFriend">
            	<view class="cell_divider newF">新的朋友</view>
            	<block v-for="(item, index) in newFriend" :key="index">
            		<cell class="row">
            			<view class="news_left">
            				<image :src="item.fromHead" mode="widthFix" class="user_img"></image>
            				<view class="news_info">
            					<view class="name">{{item.account}}</view>
            					<view class="msg">{{item.msg}}</view>					
            				</view>
            			</view>  
            								
            			<view class="news_right"> 
            	            <button type="primary" v-if="item.status === 0" @tap="pass(item.id, item.status)">接受</button>
            				<view class="pass" v-if="item.status === 1">已通过</view>
            				<view class="pass" v-if="item.status === 2">已发送验证</view>
            			</view>                       
            	    </cell>
            	</block>
            </view>   
	    </scroll-view>
	</view>
</template>

<script>
import api from '@/api/api.js';
import util from '@/common/util.js';
import cell from "@/components/list-cell/list-cell";
import storage from '@/api/storage.js';
import micon from '@/components/m-icon/m-icon'
export default{
		components: {
			cell,
			micon
		},
		data(){
			return{
				search_id:'',
				search_img:'',
				search_name:'新的朋友',
				info:'',
				search_box:false,
				newFriend:[],
				userEn: null
			}
		},
		methods:{
			Send(){
				let postData = {
					account: this.info
				};
				this.search(postData);
			},
			//  发送查询用户请求
			search(postData){
				api.getUserByAccount(postData, res =>{
					let data1 = api.getData(res);
					let myAccount = storage.getMyInfo().account;  //获取自己的账号
					if(data1 === null){
						this.search_box = 0;
					}else if(data1.account == myAccount){
						this.search_name = data1.account;
						this.search_img = data1.head;
						this.search_box = 2;
					} else {
						this.search_name = data1.account;  //记录被搜索出的用户的账号
						this.search_img = data1.head;    //记录被搜索出的用户的头像
						this.search_id = data1.id;   //记录被搜索出的用户的id
						this.info = '';
						this.search_box = 1;
					}
				})
			},
			Apply(){
                uni.navigateTo({
                	url:'../details/details?userAccount=' + this.search_name
                })
			},
			show(postData){
				api.getApplyListByUser(postData, res => {
					let data22 = api.getData(res);
					let page = api.getPageList(res);
					let myname = this.userEn.account;
					let newFriendArryay = this.newFriend;
					page.forEach(function(el){
						if(el.fromAccount === myname){
							if(el.status == 0){
								el.status = 2;
							} if(el.status == 1){
								el.status = 1;
							}
							el.fromHead = el.head;
						}
						if(el.fromAccount !== myname){
							el.account = el.fromAccount;
						}
						newFriendArryay.push(el);
					})
				})
			},
			pass(passid, passstatus){
				let this_ = this;//保存
				uni.showModal({
					title:"提示",
					content:"您确定通过Ta的好友验证吗？",
					success(res){
						if(res.confirm){
							let data1 = {
								id: passid,
								status: passstatus
							};
							this_.friendAduit(data1);
						}
					}
				})
			},
			friendAduit(postData){
				api.applyFriendAudit(postData, res => {
					console.log(res);
					let code = api.getCode(res);
					if(code === 0){
						uni.showToast({
							title:"添加好友成功!",
							image:'/static/img/check-circle.png',
							duration:2000
						})
                        this.newFriend = [];
                        let data = {
                        	account: this.userEn.account,
                        	page: 1,
                        	count: 20
                        };
                        this.show(data);
					}else {
						uni.showToast({
							title:"网络出错请稍候再试",
							image:'/static/img/fail-circle.png',
							duration:2000
						})
					}
				});
			}
		},
		onShow(){
			this.search_box = false;
			this.userEn = storage.getMyInfo();
			this.newFriend = [];
			let data = {
				account:storage.getMyInfo().account,
				page:1,
				count:6
			};
			this.show(data);
		}
}
</script>

<style>
	.content{
		height: 100%;
		overflow:auto;
	}
	.searchbox {
		width: 100%;
		height: 100rpx;
		padding: 0 10rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.search_input {
		display:block;
		width: 100%;
		height: 72rpx;
		background: #f5f6fa;
		border-radius: 36rpx;
		font-size: 30rpx;
		color: #a8abb8;
		text-align:center;
	}
	.search_img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow:hidden;
	}
	.search_img>image{
		width:100%;
		height:100%;
	}
	.cell_name {
		padding-left: 30rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.cell_divider {
		margin-top:60rpx;
		height: 66rpx;
		padding-left: 30rpx;
		font-size: 26rpx;
		color: #555;
		background: #f5f6fa;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
	}
	.newF{
		margin-top:0;
	}
	.current_box{
		width:70rpx;
		height:65rpx;
	}
	.current{
		width:100%;
		height:auto;
	}
	.row{
		display:flex;
        flex-direction: row;
		padding:10upx 15upx;
	}
	.news_left{
		display:flex;
		align-items: center;
	}
	.user_img{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		display: block;
		margin-right: 24upx;
	}
	.news_info {
		max-width: 500upx;
		min-height: 80upx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 30upx;
		line-height: 1;
		color: #262b3a;
	}
	.msg {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 28upx;
		line-height: 1;
		color: #9397a4;
		padding:10rpx 4rpx;
	}
	.news_right {
		margin-left: auto;
		text-align: right;
	}
	.news_right>button{
		background:#18AE19;
		height:70rpx;
		width:120rpx;
		font-size:12px;
	}
	.pass,.empty>text{
		color: #999;
	}
	.Friend_btn{
		width:0;
		height:0;
		padding:2rpx;
	}
	.empty{
		justify-content: center;
	}
	.newFriend{
		overflow-y:auto;
	}
</style>
