const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data: {
        newLabelToggle: false,
        user: {
            name: '',
            phone: '',
            avatar: '',
            email: '',
            editor: 1
        },
        form: {
            label: {
                uid: '',
                name: ''
            },
            article: {
                uid: '',
                labelId: '5c3bef8f8aee742914b4a9b5',
                title: '',
                content: '',
                markDown: '',
                html: ''
            }
        },
        labels: [{
            name: '',
            selected: true
        }],
        articles: [{
            title: '',
            selected: true
        }],
        editor: null
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
                    this
                    this.form.label.uid = this.user._id;
                    this.form.article.uid = this.user._id;
                    this.getLabels();
                    this.initEditor();
                }
            }).catch(err => {
                console.log(err);
            });
        },
        getLabels: function() {
            this.$http.get('/api/label/lists?uid=' + this.user._id).then(res => {
                console.log(res);
                if (res.body.code && res.body.ok) {
                    let lists = res.body.data.list;
                    let articles = lists[0].articles.length ? lists[0].articles[0] : [];
                    lists.forEach((item, index) => {
                        item.selected = false;
                        if (index == 0) {
                            item.selected = true;
                        }
                    })
                    this.labels = lists;
                    this.articles = articles;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        newLabelToggleListener: function() {
            this.newLabelToggle = !this.newLabelToggle;
        },
        addLabelFormSubmit: function(e) {
            this.$http.post('/api/label/add', {
                uid: this.form.label.uid,
                name: this.form.label.name
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        addLabelFormReset: function(e) {
            this.form.label.name = '';
            this.newLabelToggle = !this.newLabelToggle;
        },
        addArticle: function() {
            this.form.article.title = Utils.formateDate();
            this.$http.post('/api/article/add', {
                uid: this.form.article.uid,
                labelId: this.form.article.labelId,
                title: this.form.article.title
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        initEditor: function() {
            if (this.user.editor) {
                this.editor = editormd('editor-container', {
                    placeholder: '编写你的博客文章。。。。', //默认显示的文字，这里就不解释了
                    width: "100%",
                    height: 780,
                    syncScrolling: "single",
                    path: "/static/js/libs/editor.md-master/lib/", //你的path路径（原资源文件中lib包在我们项目中所放的位置）
                    theme: "default", //工具栏主题
                    previewTheme: "default", //预览主题
                    editorTheme: "default", //编辑主题
                    saveHTMLToTextarea: true, // 保存html到textarea中
                    emoji: true,
                    taskList: true,
                    tocm: true, // Using [TOCM]
                    tex: true, // 开启科学公式TeX语言支持，默认关闭
                    flowChart: true, // 开启流程图支持，默认关闭
                    sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
                    toolbarIcons: function() { //自定义工具栏，后面有详细介绍
                        return editormd.toolbarModes['simple']; // full, simple, mini
                        // 自定义工具栏
                        // return ["undo", "redo", "|", "bold", "hr", "|", "preview", "watch", "|", "fullscreen", "info", "testIcon", "testIcon2", "file", "faicon", "||", "watch", "fullscreen", "preview", "testIcon", "file"]
                    },
                    imageUpload: true,
                    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                    imageUploadURL: "./php/upload.php",
                    onload: function() {
                        this.setMarkdown();
                    }
                });
                // this.editor.getMarkdown(); // 获取 Markdown 源码
                // this.editor.setMarkdown(''); // 设置markDown
                // this.editor.setHTML(''); // 设置html
                // this.editor.getHTML(); // 获取 Textarea 保存的 HTML 源码
                // this.editor.getPreviewedHTML(); // 获取预览窗口里的 HTML，在开启 watch 且没有开启 saveHTMLToTextarea 时使用
                // this.editor.getValue(); // 获取editor的值

                //上传图片response
                /*
                     上传的后台只需要返回一个 JSON 数据，结构如下：
                     {
                        success : 0 | 1,           // 0 表示上传失败，1 表示上传成功
                        message : "提示的信息，上传成功或上传失败及错误信息等。",
                        url     : "图片地址"        // 上传成功时才返回
                     }
                     */
            } else {
                this.editor = new wangEditor('#editor-container');
                // 或者 var editor = new E( document.getElementById('editor') );
                this.editor.customConfig.menus = [
                    'head', // 标题
                    'bold', // 粗体
                    'italic', // 斜体
                    'underline', // 下划线
                    'strikeThrough', // 删除线
                    'foreColor', // 文字颜色
                    'backColor', // 背景颜色
                    'link', // 插入链接
                    'list', // 列表
                    'justify', // 对齐方式
                    'quote', // 引用
                    'emoticon', // 表情
                    'image', // 插入图片
                    'table', // 表格
                    'video', // 插入视频
                    'code', // 插入代码
                    'undo', // 撤销
                    'redo' // 重复
                ];
                this.editor.create();
                this.editor.txt.html('<p>用 JS 设置的内容</p>');
                // 读取html内容
                // this.editor.txt.html();
                // 读取Text内容
                // this.editor.txt.text();
            }
        },
        labelItemSelector: function(e, index) {
            let labelItems = this.$refs.labelListItem.getElementsByClassName('label-list-items'),
                i = 0;
            for (i; i < labelItems.length; i++) {
                labelItems[i].className = 'label-list-items';
                labelItems[i].setAttribute('data-selected', false);
            }
            labelItems[index].className = 'label-list-items label-list-items-selected';
            labelItems[index].setAttribute('data-selected', true);
            this.form.article.labelId = this.labels[index]._id;
            this.articles = this.labels[index].articles ? this.labels[index].articles : [];
            if (this.articles.length) {
                this.articles.forEach((article, index) => {
                    article.selected = false;
                    if (index == 0) {
                        article.selected = true;
                    }
                });
            }
            console.log(this.articles)
        },
        articleTitleItemSelect: function(e, index) {
            let articleTitleItems = this.$refs.articleTitleItem.getElementsByClassName('article-title-items'),
                i = 0;
            for (i; i < articleTitleItems.length; i++) {
                articleTitleItems[i].className = 'article-title-items';
                articleTitleItems[i].setAttribute('data-selected', false);
            }
            articleTitleItems[index].className = 'article-title-items article-title-items-selected';
            articleTitleItems[index].setAttribute('data-selected', true);
        },
        articleEditorSave: function() {
            console.log(this.editor.getMarkdown());
        }
    },
    mounted() {
        this.init();
    }
});