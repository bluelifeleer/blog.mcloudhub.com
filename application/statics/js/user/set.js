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
            name: '',
            phone: '',
            email: '',
            editor: 1,
            avatar: '',
            href: '',
            introduce: ''
        },
        setting:{
            account_form:{
                name:'',
                phone:'',
                email:'',
                avatar:'',
                editor:1
            }
        }
    },
    created() {},
    methods: {
        init: function() {
            if (Utils.getCookie('uid')) {
                this.getUser();
            }
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
        uploadAvatar:function(e){
            let _this = this;
            let userAvatar = this.$refs.userAvatar;
            let file = e.target.files[0];
            if(file){
                let Reader = new FileReader();
                Reader.readAsDataURL(file);
                Reader.addEventListener('load', function(e) {
                    userAvatar.src=Reader.result
                    // _this.$http.post('/api/adv/picture/upload', {
                    //     uid: _this.users.uid,
                    //     name: file.name,
                    //     size: file.size,
                    //     type: file.type,
                    //     base_data: Reader.result
                    // }).then(res => {
                    //     if (res.body.code && res.body.ok) {
                    //         _this.adv.slides[index].url = res.body.data.url;
                    //     }
                    // }).catch(err => {
                    //     console.log(err)
                    // })
                }, false);
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
        this.init();
    }
});