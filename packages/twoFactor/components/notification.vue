<template>
	<div id="twoFactorNotice" class="notification">
		<div class="notification-content">
			<p>
				当前页面有<span class="g_danger">敏感数据</span>，如需查看，请进行双因子认证。
			</p>
			<button @click="onGoVerify">点击认证</button>
		</div>
		<div class="notification-close" @click="onClose">x</div>
	</div>
</template>

<script>
export default {
	name: 'notification',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			noticeShow: this.show,
		}
	},
	methods: {
		onGoVerify() {
			this.$emit('goVerify');
		},
		onClose() {
			this.$emit('close');
		},
	},
}
</script>

<style lang="scss" scoped>
@import './style/global.scss';
.notification {
	padding: 10px;
	background: #fff;
	animation: slide-in .3s ease-out;
	position: fixed;
	top: 50px;
	right: 10px;
	box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
	font-size: 14px;
	display: flex;
	align-items: flex-start;
	width: 300px;
	z-index: 9998;
	&-content {
		flex: 1;
		p {
			white-space: initial;
		}
	}
	&-close {
		width: 30px;
		height: 30px;
		display: flex;
		cursor: pointer;
		align-items: center;
		justify-content: center;
	}
}
@media screen and (max-width: 580px) {
	.notification {
		width: 80% !important;
	}
}
@keyframes slide-in {
	0% {
		right: -100%;
		opacity: .5;
	}
	70% {
		right: 14px;
	}
	90% {
		right: 8px;
	}
	100% {
		right: 10px;
		opacity: 1;
	}
}
</style>
