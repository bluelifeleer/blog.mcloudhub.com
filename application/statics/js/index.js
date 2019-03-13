const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        searchBlur: false,
        showUserProfile: false,
        search:{
            Keyword:'',
            result:[],
        },
        components: {
            message: {
                enable: false,
                type: 'info',
                text: '',
                icon: true
            }
        },
        user: {
            id: '',
            name: '',
            avatar: '',
            phone: '',
            email: '',
            href: '',
            introduce: ''
        },
        articles: {
            count: 0,
            pages: 0,
            size: 1,
            num: 20,
            list: []
        }
    },
    created() {
        this.init();
    },
    methods: {
        init: function() {
            if (Utils.getCookie('uid')) {
                this.getUser();
            }
            this.getArticles();
        },
        documentClickListener: function(e){
            this.showUserProfile = false;
        },
        getUser: function() {
            let uid = Utils.getCookie('uid');
            this.$http.get('/api/user/get?id=' + uid).then(res => {
                if (res.body.code && res.body.ok) {
                    let data = res.body.data;
                    data.href = '/user/center?id=' + data._id;
                    this.user = data;
                }
            }).catch(err => {
                console.log(err);
            });
        },
        searchFoucsListener: function(e){
            let searchButIcon = this.$refs.searchButIcon;
            searchButIcon.style.background = '#969696';
            searchButIcon.style.color = '#FFF';
        },
        searchBlurListener: function(e) {
            this.searchBlur = true;
            let searchButIcon = this.$refs.searchButIcon;
            searchButIcon.style.background = '';
            searchButIcon.style.color = '#969696';
        },
        searchSubmit: function(e){
            if(!this.search.keyword){
                alert('请输入要搜索的关键字')
            }
            console.error('search keyword')
        },
        showUserProfileToggle: function(e) {
            this.showUserProfile = !this.showUserProfile;
        },
        getArticles: function() {
            let _this = this;
            this.$http.get('/api/article/lists?num=' + this.articles.num + '&size=' + this.articles.size + '&count=' + this.articles.count).then(res => {
                if (res.body.code && res.body.ok) {
                    let data = res.body.data;
                    let list = data.list;
                    list.forEach((item, index) => {
                        if (/<img.*?(?:>|\/>)/gi.test(item.content)) {
                            item.hasImg = true;
                            item.icon = item.content.match(/<img.*?(?:>|\/>)/gi)[0];
                        } else {
                            item.hasImg = false;
                            item.icon = '';
                        }
                        let content = item.content ? item.content.replace(/<[^>]*>/g, "") : '';
                        item.content = content.length >= 100 ? content.substr(0, 100) + '...' : content;
                        item.nowTitle = item.title.length >= 60 ? (item.title.substr(0, 60) + '....') : item.title;
                        item.href = '/article/detaile?id=' + item._id;
                        item.own.href = '/user/center?id=' + item.own._id;
                        item.date = Utils.formateDate(item.date);
                        item.updateTime = Utils.formateDate(item.updateTime);
                        _this.articles.list.push(item);
                    });
                    this.articles.count = data.count;
                    this.articles.pages = data.pages;
                    this.articles.size = data.size;
                    this.articles.num = data.num;
                }
            }).catch(err => {
                console.log(err)
            })
        },
        articleHeart: function(e, article, uid){
            if(!uid){
                window.location.href = '/login'
            }else{
                this.$http.post('/api/article/heart',{id:article._id, uid:uid}).then(res=>{
                    if(res.body.code && res.body.ok){
                        this.message({
                            type: 'success',
                            text:'操作成功'
                        });
                    }else{
                        this.message({
                            type: 'error',
                            text: '评论失败'
                        });
                    }
                    this.getArticles();
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        articleComment: function(e, article, uid){
            if(!uid){
                window.location.href = '/login?redirect_uri=/article/detaile#comments?id='+article._id;
            }else{
                window.location.href = '/article/detaile#comments?id='+article._id;
            }
        },
        loadMores: function(e){
            if(this.articles.size > this.articles.pages){
                this.message({
                    enable:true,
                    type: 'warning',
                    text:'已经没有更多了'
                });
            }else{
                this.message({
                    enable:true,
                    type: 'success',
                    text:'加载成功'
                });
                this.getArticles();
            }
        },
        message:function(options){
            let _this = this;
            let widthW = document.body.clientWidth || document.documentElement.clientWidth;
            let componentMessage = this.$refs.componentMessage;
            componentMessage.style.left = parseInt((widthW-400)/2)+'px'
            this.components.message.enable = options.enable ? options.enable : true ;
            this.components.message.type = options.type ? options.type : this.components.message.type ;
            this.components.message.text = options.text ? options.text : this.components.message.text ;
            this.components.message.icon = options.icon ? options.icon : this.components.message.icon ;
            setTimeout(function(){
                _this.components.message.enable = false;
            },3000);
        },
        signout: function() {
            this.showUserProfile = !this.showUserProfile;
            this.$http.get('/api/signout').then(res => {
                if (res.body.code && res.body.ok) {
                    window.location.href = '/login';
                }
            }).catch(err => {
                console.log(err)
            });
        }
    },
    mounted() {
        // this.init();
    }
});