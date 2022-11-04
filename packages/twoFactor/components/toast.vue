<template>
  <transition name="toast-top">
    <div class="toast flex black_bg white pd_1 br" v-show="toastShow">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
	name: 'wToast',
	props: {
		message: {
			type: String,
			default: '',
		},
		duration: {
			type: Number,
			default: 2000,
		},
		show: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			toastShow: this.show,
		}
	},
	watch: {
		show: {
			handler() {
				this.toastShow = this.show;
				if (this.toastShow) {
					this.onShowToast();
				}
			},
			immediate: true,
		},
	},
	methods: {
		onShowToast() {
			this.toastShow = true;
			setTimeout(() => {
				this.toastShow = false;
				this.$emit('update:show', false);
			}, this.duration);
		},
	},
}
</script>

<style lang="scss" scoped>
.toast {
  min-width: 60px;
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 10001;
  transition: top .3s;
  text-align: center;
  max-width: 200px;
	background: #fff;
	border-radius: 5px;
	padding: 10px 20px;
	font-size: 14px;
	box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
}
.toast-top-enter {
	top: -100px;
}
.toast-top-enter-to {
	top: 10%;
}
.toast-top-leave-to {
	top: -100px;
}
.toast-top-leave {
	top: 10%;
}

</style>
