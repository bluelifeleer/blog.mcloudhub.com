const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {},
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
        }
    },
    mounted() {
        this.init();
    }
});