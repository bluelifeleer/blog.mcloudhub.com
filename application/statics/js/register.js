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
                confirmPassword: '',
                email: ''
            }
        }
    },
    created() {},
    methods: {
        init: function() {
            this.getPageBG();
        },
        getPageBG: function() {
            this.$http.get('https://api.i-meto.com/api/v1/bing/random?new').then(res => {
                this.pageSet.background = 'url("' + res.body.url + '") no-repeat 0 0';
            });
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

            if (!this.form.user.confirmPassword) {
                alert('确认密码不能为空');
                return false;
            }

            if (!this.form.user.password == this.form.user.confirmPassword) {
                alert('两次输入密码不同');
                return false;
            }

            this.$http.post('/api/signup', {
                name: this.form.user.name,
                password: this.form.user.password,
                confirmPassword: this.form.user.confirmPassword,
                email: this.form.user.email
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
        this.init()
    }
})