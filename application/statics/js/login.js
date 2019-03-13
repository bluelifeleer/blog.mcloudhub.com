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
				checked: false,
				verifyCode:''
			},
			checkbox: {
				label: '记住密码',
				value: false,
				icon: '&#xe6c5;'
			},
			showPassword:false
		}
	},
	created() {
		this.init();
	},
	methods: {
		init: function(){
			this.getPageBG()
		},
		getPageBG: function(){
			this.$http.get('https://api.i-meto.com/api/v1/bing/random?new').then(res => {
			this.pageSet.background = 'url("'+res.body.url+'") no-repeat 0 0';
			});
		},
		passwordViewToggle: function(e){
            this.form.showPassword = !this.form.showPassword;
            this.$refs.passwordInputBox.type = this.form.showPassword ? 'text' : 'password';
        },
		checkboxToggle: function(e) {
			this.form.checkbox.value = !this.form.checkbox.value;
			this.form.checkbox.icon = this.form.checkbox.value ? '&#xe642;' : '&#xe6c5;';
			this.form.user.created = this.form.checkbox.value;
		},
		signinFormSubmit: function(e){
			let redirect_uri = Utils.getQueryString('redirect_uri');
			if(!this.form.user.name){
				alert('用户名不能为空');
				return false;
			}

			if(!this.form.user.password){
				alert('密码不能为空');
				return false;
			}

			if(!this.form.user.verifyCode){
				alert('验证码不能为空');
				return false;
			}

			this.$http.post('/api/signin', {name: this.form.user.name, password: this.form.user.password, checked: this.form.user.checked, verifyCode: this.form.user.verifyCode}).then(res=>{
				if(res.body.code && res.body.ok){
					switch(res.body.code){
						case 2:
						window.location.href = '/register'
						break;
						default:
							window.location.href = redirect_uri ? redirect_uri : '/';
						break;
					}
				}else{
					alert(res.body.msg);
					return false;
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		otherLoginIn: function(e, type){
			this.$http.get('/other/loginin?type='+type).then(res=>{
				if(res.ok && res.status == 200){
					if(res.body.ok && res.body.code){
						let data = res.body.data;
						window.location.href = 'https://github.com/login/oauth/authorize?client_id='+data.client_id+'&redirect_uri='+data.redirect_uri+'&state='+data.state+'&scope=user';
					}
				}
			}).catch(err=>{
				console.log(err)
			})
		}
	},
	mounted() {
		// this.init()
		let _this = this;
		document.addEventListener('keyup',function(e){
			if(e.keyCode == 13){
				_this.signinFormSubmit(e)
			}
		},false)
	}
})
