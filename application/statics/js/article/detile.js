const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        showUserProfile: false,
        user: {
            name: '',
            phone: '',
            email: '',
            editor: 1,
            avatar: '',
            href: ''
        },
        article: {
            title: '',
            content: '',
            own: {
                name: '',
                avatar: ''
            },
            label: {
                name: ''
            }
        }
    },
    created() {},
    methods: {
        init: function() {
            if (Utils.getCookie('uid')) {
                this.getUser();
            }
            this.getArticle();
        },
        getUser: function() {
            let uid = Utils.getCookie('uid');
            this.$http.get('/api/user/get?id=' + uid).then(res => {
                if (res.body.code && res.body.ok) {
                    let data = res.body.data;
                    data.href = '/user/profile?id='+data._id;
                    this.user = data;
                }
            }).catch(err => {
                console.log(err);
            });
        },
        showUserProfileToggle: function(e) {
            this.showUserProfile = !this.showUserProfile;
        },
        getArticle: function() {
            id = Utils.getQueryString('id');
            this.$http.get('/api/article/get?id=' + id).then(res => {
                if (res.body.code && res.body.ok) {
                    let article = res.body.data.article;
                    article.own.href = '/user/profile?id='+article.own._id;
                    article.nowTitle = article.title.length >=100 ? article.title.substr(0, 100)+ '....': article.title;
                    article.updateTime = Utils.formateDate(article.updateTime);
                    this.article = article;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        signout: function(){
            this.showUserProfile = !this.showUserProfile;
            this.$http.get('/api/signout').then(res=>{
                if(res.body.code && res.body.ok){
                    window.location.href= '/login';
                }
            }).catch(err=>{
                console.log(err)
            });
        }
    },
    mounted() {
        this.init();
    }
});