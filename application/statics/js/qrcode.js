'use strict';
const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        form: {
            text: ''
        },
        qrcode: {
            url: ''
        }
    },
    created() {},
    methods: {
        init: function() {},
        documentClickListener: function(e){
            this.showUserProfile = false;
        },
        qrcodeFormSubmit: function(e) {
            this.$http.get('/api/qrcode?text=' + this.form.text).then(res => {
                console.log(res)
                if (res.body.code && res.body.ok) {
                    this.qrcode.url = res.body.data.url
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.init();
    }
});