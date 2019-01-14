'use strict';
const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		title: '登录',
		pageSet: {
			background: ''
		},
		form: {
			user: {
				name: '',
				password: '',
				checked: false
			},
			checkbox: {
				label: '记住密码',
				value: false,
				icon: '&#xe6c5;'
			}
		}
	},
	created() {},
	methods: {
		init: function(){
			this.getPageBG()
		},
		getPageBG: function(){
			this.$http.get('https://api.i-meto.com/api/v1/bing/random?new').then(res => {
			this.pageSet.background = 'url("'+res.body.url+'") no-repeat 0 0';
			});
		},
		checkboxToggle: function(e) {
			this.form.checkbox.value = !this.form.checkbox.value;
			this.form.checkbox.icon = this.form.checkbox.value ? '&#xe642;' : '&#xe6c5;';
			this.form.user.created = this.form.checkbox.value;
		},
		signinFormSubmit: function(e){
			if(!this.form.user.name){
				alert('用户名不能为空');
				return false;
			}

			if(!this.form.user.password){
				alert('密码不能为空');
				return false;
			}

			this.$http.post('/api/signin', {name: this.form.user.name, password: this.form.user.password, checked: this.form.user.checked}).then(res=>{
				console.log(res);
				if(res.body.code && res.body.ok){
					alert('登录成功');
					window.location.href = '/';
				}
			}).catch(err=>{
				console.log(err);
			})
		}
	},
	mounted() {
		this.init()
	}
})
