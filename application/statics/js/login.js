'use strict';
const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		title: '登录',
		form: {
			user: {
				name: '',
				password: '',
				checked: true
			}
		}
	},
	created() {},
	methods: {
		rememberClick: function(e) {
			this.form.user.checked = !this.form.user.checked;
		}
	},
	mounted() {

	}
})
