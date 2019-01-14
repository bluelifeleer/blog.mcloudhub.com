const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        searchBlur: false,
        user: {
            id: '',
            name: '',
            avatar: '',
            phone: '',
            email: ''
        }
    },
    created() {},
    methods: {
        init: function() {
            if (Utils.getCookie('uid')) {
                this.getUser();
            }
        },
        getUser: function() {
            let uid = Utils.getCookie('uid');
            this.$http.get('/api/user/get?id=' + uid).then(res => {
                if (res.body.code && res.body.ok) {
                    let data = res.body.data;
                    this.user = data;
                }
            }).catch(err => {
                console.log(err);
            });
        },
        searchBlurListener: function() {
            this.searchBlur = true;
        }
    },
    mounted() {
        this.init();
    }
});