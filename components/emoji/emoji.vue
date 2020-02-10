<template>
	<swiper class="emoji-swiper" indicator-dots="true" duration="150">
		<swiper-item v-for="(page,pid) in emojiList" :key="pid">
			<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
				<image mode="widthFix" :src="'/static/img/emoji/'+em.url"></image>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
import em from '@/common/em.js';
export default{
	data() {
		return {
			emojiList: []//em.emojiList  //表情列表
		}
	},
	methods:{
		//初始化数据，可以延迟加载表情
		initData() {
			this.emojiList = em.emojiList;
		},
		
		//选择某个表情
		addEmoji(em){
			this.$emit("addEmoji", em);
		}
	}
}
</script>

<style lang="scss">
	@import "@/static/style/style.scss";
</style>
