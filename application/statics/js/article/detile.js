const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        searchBlur: false,
        showUserProfile: false,
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
        searchBlurListener: function() {
            this.searchBlur = true;
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
                this.$http.post('/api/comment/add', {
                    uid: this.form.comment.uid,
                    id: this.form.comment.id,
                    content: this.form.comment.content
                }).then(res => {
                    console.log(res);
                    if (res.body.code && res.body.ok) {

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
                    console.log(res);
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
                    console.log(res);
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
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }
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