'use strict';
const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        title: '注册',
        pageSet: {
            background: ''
        },
        form: {
            user: {
                name: '',
                password: '',
                email: '',
                verifyCode: ''
            },
            showPassword: false
        }
    },
    created() {
        this.init();
    },
    methods: {
        init: function() {
            this.getPageBG();
        },
        getPageBG: function() {
            this.$http.get('https://api.i-meto.com/api/v1/bing/random?new').then(res => {
                this.pageSet.background = 'url("' + res.body.url + '") no-repeat 0 0';
            });
        },
        passwordViewToggle: function(e){
            this.form.showPassword = !this.form.showPassword;
            this.$refs.passwordInputBox.type = this.form.showPassword ? 'text' : 'password';
        },
		refreshVerifyCode:function(e){
            let MyDate = new Date();
			this.$refs.verifyCodeImg.src = 'https://blog.mcloudhub.com/captcha/captcha?time='+MyDate.getTime();
		},
        signupFormSubmit: function(e) {

            if (!this.form.user.name) {
                alert('用户名不能为空');
                return false;
            }

            if (!this.form.user.password) {
                alert('密码不能为空');
                return false;
            }

            this.$http.post('/api/signup', {
                name: this.form.user.name,
                password: this.form.user.password,
                email: this.form.user.email,
                verifyCode: this.form.user.verifyCode
            }).then(res => {
                if (res.body.code && res.body.ok) {
                    if (res.body.code == 1) {
                        window.location.href = '/login';
                    } else {
                        alert(res.body.msg)
                    }
                } else {
                    alert(res.body.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        // this.init();
        document.addEventListener('keyup',function(e){
			if(e.keyCode == 13){
				_this.signupFormSubmit(e)
			}
		},false)
    }
})