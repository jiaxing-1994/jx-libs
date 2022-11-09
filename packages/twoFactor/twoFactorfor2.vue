<template>
	<div id="twoFactorModal" class="twoFactor">
		<div style="width: 100%;height: 100%;position:relative">
			<div class="twoFactor_mask"></div>
			<div class="twoFactor_content" v-show="!verifySuccess">
				<header>
					<div>系统提示</div>
					<div class="close-btn" @click="onClose">x</div>
				</header>
				<p class="tip">请进行双因子认证</p>
				<p class="tip_1">{{ msgText }}</p>
				<div class="form">
					<div class="form-item">
						<label>手机号:</label>
						<div class="form-item_content">
							<input style="text-align: center" type="text" maxlength="6" value="当前登陆手机号" readonly/>
						</div>
					</div>
					<div class="form-item">
						<label>验证码:</label>
						<div class="form-item_content">
							<input type="number" v-model:value="verifyCode"/>
							<button @click="onSendCode">{{ isOnTimer ? `${timeCode}秒后再次发送` : isSendingCode ? '发送中...' : '发送验证码' }}</button>
						</div>
					</div>
				</div>
				<p class="tip_1">验证成功后，{{ period === null ? '会有一定的有效期' : `有效期为${period}分钟` }}，超出有效期后需要再次认证</p>
				<footer>
					<button @click="onVerify">{{ isVerifyCode ? '验证中...' : '立即验证' }}</button>
				</footer>
			</div>
		</div>
		<toast :show.sync="toastShow" :message="toastMsg" :type="toastType"></toast>
	</div>
</template>

<script>
import Toast from './components/toast.vue';
export default {
	name: 'twoFactorFor2',
	components: {
		Toast,
	},
	props: {
		type: {
			type: Number,
			default: 1,
		},
		period: {
			type: [Number, null],
			default: null,
		},
		token: {
			type: String,
			default: '',
		},
		projectId: {
			type: String,
			default: '',
		},
		http: {
			type: Object,
		},
	},
	data() {
		return {
			toastShow: false,
			toastType: 'info',
			toastMsg: '',
			verifyCode: '',
			time: 60,
			timeCode: this.time,
			isOnTimer: null,
			isSendingCode: false,
			isVerifyCode: false,
			verifySuccess: false,
		}
	},
	computed: {
		msgText() {
			switch (this.type) {
				case 1: return '当前页面包含敏感数据，您需要先完成认证，才能查看具体内容';
				case 2: return '当前操作设置了双因子认证，您需要先完成认证，才能操作成功';
				case 3: return '当前页面包含敏感数据，编辑前需要进行双因子认证';
			}
		},
	},
	methods: {
		async onVerify() {
			if (!/^\d{6}$/.test(this.verifyCode)) {
				this.showToast('请输入6位正确的验证码', 'warn');
				return;
			}
			if (this.isVerifyCode) {
				return;
			}
			try {
				this.isVerifyCode = true;
				await this.verifyCodeApi();
				this.isVerifyCode = false;
				if ([1, 3].includes(this.type)) {
					this.showToast('验证成功,即将刷新页面以重新获取数据!', 'success');
					this.verifySuccess = true;
					setTimeout(() => {
						window.location.reload();
						this.$emit('verified');
					}, 3000);
				} else {
					this.showToast('验证成功,请重新进行之前操作!', 'success');
					this.verifySuccess = true;
					setTimeout(() => {
						this.$emit('verified');
					}, 3000);
				}
			} catch(e) {
				console.log(e);
				this.isVerifyCode = false;
			}
		},
		onClose() {
			if (this.type === 3) {
				window.location.reload();
			}
			this.$emit('close');
		},
		async onSendCode() {
			if (this.isOnTimer || this.isSendingCode) {
				return;
			}
			// 调用发送接口
			try {
				this.isSendingCode = true;
				await this.sendCodeApi();
				this.isSendingCode = false;
				this.showToast('发送成功', 'success');
				// 开启计时
				this.startOn();
			} catch (e) {
				console.log(e);
				this.isSendingCode = false;
			}
		},
		startOn() {
			this.timeCode = this.time;
			this.isOnTimer = setInterval(() => {
				this.timeCode -= 1;
				if (this.timeCode === 0) {
					clearInterval(this.isOnTimer);
					this.timeCode = this.time;
					this.isOnTimer = null;
				}
			}, 1000);
		},
		showToast(msg, type = 'info') {
			this.toastShow = true;
			this.toastMsg = msg;
			this.toastType = type;
		},

		async sendCodeApi() {
			const res = await this.http.get(`/safety-certificate/verify/open/sendVerifyCode?projectId=${this.projectId}`, undefined, undefined, {
				two_factor_token: this.token,
			});
			if (res.status === 200 && res.data.success) {
				return true;
			}
			this.showToast(res.data.message, 'danger');
			return await Promise.reject(res.data.message);
		},
		async verifyCodeApi() {
			const res = await this.http.get(`/safety-certificate/verify/open/verify?code=${this.verifyCode}`, undefined, undefined, {
				two_factor_token: this.token,
			});
			if (res.status === 200 && res.data.success) {
				return true;
			}
			this.showToast('验证码错误', 'danger');
			this.verifyCode = '';
			return await Promise.reject(res.data.message);
		}
	},
}
</script>

<style lang="scss" scoped>
@import './style/global.scss';
.tip {
	font-size: 14px;
	&_1 {
		font-size: 12px;
		color: #aeaeae;
	}
}
.twoFactor {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
.twoFactor_mask {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(0, 0, 0, .3);
	z-index: 9999;
	animation: opacity .3s ease-out;
}
.twoFactor_content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #fff;
	z-index: 10000;
	padding: 20px;
	font-size: 14px;
	width: 40%;
	text-align: center;
	border-radius: 10px;
	animation: fade .3s ease-out;
	.close-btn {
		cursor: pointer;
		width: 30px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 10px;
		font-weight: bold;
		border-bottom: solid 1px #ddd;
	}
	.form {
		display: flex;
		flex-direction: column;
		.form-item {
			width: 100%;
			max-width: 300px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 10px;
			label {
				white-space: nowrap;
			}
			&_content {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border: solid 1px #ddd;
				border-radius: 5px;
				overflow: hidden;
				width: 100%;
				input {
					flex: 1;
				}
				button {
					height: 100%;
					min-width: 60px;
				}
			}
		}
	}
	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		button {
			width: 50%;
			height: 40px;
		}
	}
}
@media screen and (min-width: 580px) {
	.form {
		align-items: center;
		.form-item {
			margin: 0 auto;
			label {
				margin-right: 10px;
			}
			&_content {
				height: 30px;
			}
		}
	}
}
@media screen and (max-width: 580px) {
	.twoFactor_content {
		width: 80%!important;
	}
	.form {
		align-items: flex-start;
		.form-item {
			width: 100%;
			margin: 0;
			flex-direction: column;
			label {
				margin-bottom: 5px;
			}
			&_content {
				height: 40px;
			}
		}
	}
}

@keyframes opacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

@keyframes fade {
	0% {
		transform: translate(-50%, -50%) scale(.8);
		opacity: 0.3;
	}
	60% {
		transform: translate(-50%, -50%) scale(1.05);
	}
	90% {
		transform: translate(-50%, -50%) scale(0.98);
	}
	100% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
}
</style>
