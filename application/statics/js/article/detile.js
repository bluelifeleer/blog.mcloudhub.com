const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        searchBlur: false,
        showUserProfile: false,
        commentReplysForm: false,
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
            name: '',
            phone: '',
            email: '',
            editor: 1,
            avatar: '',
            href: '',
            introduce: ''
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
            },
            comments: []
        },
        form: {
            comment: {
                id: '',
                uid: '',
                content: ''
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
        documentClickListener: function(e){
            this.showUserProfile = false;
        },
        getUser: function() {
            let uid = Utils.getCookie('uid')
            this.$http.get('/api/user/get?id=' + uid).then(res => {
                if (res.body.code && res.body.ok) {
                    let data = res.body.data;
                    data.href = '/user/center?id=' + data._id;
                    this.form.comment.uid = data._id;
                    this.user = data;
                }
            }).catch(err => {
                console.log(err);
            });
        },
        showUserProfileToggle: function(e) {
            this.showUserProfile = !this.showUserProfile;
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
        getArticle: function() {
            id = Utils.getQueryString('id');
            this.$http.get('/api/article/get?id=' + id).then(res => {
                if (res.body.code && res.body.ok) {
                    let article = res.body.data.article;
                    this.form.comment.id = article._id;
                    article.own.href = '/user/center?id=' + article.own._id
                    article.own.introduce = article.own.introduce ? article.own.introduce : '暂无介绍。。。';
                    article.own.keyWord = article.own.keyWord ? article.own.keyWord : 0;
                    article.own.follow = article.own.follow ? article.own.follow : 0;
                    article.label.href = '/user/label?id=' + article.label._id
                    article.nowTitle = article.title.length >= 100 ? article.title.substr(0, 100) + '....' : article.title
                    article.updateTime = Utils.formateDate(article.updateTime)
                    let comments = article.comments;
                    if (comments.length) {
                        comments.forEach((comment, index) => {
                            comment.own.href = '/user/center?id=' + comment.own._id;
                            comment.heart = comment.heart ? comment.heart : 0;
                            comment.date = Utils.formateDate(comment.date);
                        });
                    }
                    this.article = article;
                }
            }).catch(err => {
                console.log(err)
            })
        },
        articleCommentFormSubmit: function(e, id, uid) {
            if (!uid) {
                window.location.href = '/login';
            } else {

                if(!this.form.comment.content){
                    this.message({
                        text: '请添加评论内容',
                        type: 'warning'
                    });
                    return false;
                }

                this.$http.post('/api/comment/add', {
                    uid: this.form.comment.uid,
                    id: this.form.comment.id,
                    content: this.form.comment.content
                }).then(res => {
                    if (res.body.code && res.body.ok) {
                        this.message({
                            text: '评论成功',
                            type: 'success'
                        });
                    }else{
                        this.message({
                            text: '评论失败',
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        articleCommentFormCancle: function(e) {
            this.form.comment.uid = '';
            this.form.comment.id = '';
            this.form.comment.content = '';
        },
        articleHeart: function(e, id, userId) {
            if (!userId) {
                window.location.href = '/login';
            } else {
                this.$http.post('/api/article/heart', {
                    id: id,
                    uid: userId
                }).then(res => {
                    if(res.body.code && res.body.ok){
                        this.message({
                            text: '操作成功',
                            type: 'success'
                        });
                    }else{
                        this.message({
                            text: '操作失败',
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        commentHeart: function(e, id, userId, articleId) {
            if (!userId) {
                window.location.href = '/login';
            } else {
                this.$http.post('/api/comment/heart', {
                    id: id,
                    userId: userId,
                    articleId: articleId
                }).then(res => {
                    if(res.body.code && res.body.ok){
                        this.message({
                            text: '操作成功',
                            type: 'success'
                        });
                    }else{
                        this.message({
                            text: '操作失败',
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        articleAuthorFollow: function(e, id, articleOwnId) {
            if (!id) {
                window.location.href = '/login';
            } else {
                this.$http.post('/api/user/follow', {
                    id: id,
                    articleOwnId: articleOwnId
                }).then(res => {
                    if(res.body.code && res.body.ok){
                        this.message({
                            text: '关注作者成功',
                            type: 'success'
                        });
                    }else{
                        this.message({
                            text: '关注作者失败',
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        showCommentReplysForm: function(e){
            this.commentReplysForm = !this.commentReplysForm;
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
                console.log(err);
            });
        }
    },
    mounted() {
        this.init();
    }
})