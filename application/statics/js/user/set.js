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
                uid:'',
                name:'',
                phone:'',
                email:'',
                avatar:'',
                editor:1,
                sex: 3,
                introduce: '',
                website: '',
                reward: 1,
                reward_desc: ''
            }
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
                    this.setting.account_form.uid = data._id;
                    this.setting.account_form.avatar = data.avatar;
                    this.setting.account_form.name = data.name;
                    this.setting.account_form.phone = data.phone;
                    this.setting.account_form.email = data.email;
                    this.setting.account_form.editor = data.editor;
                    this.setting.account_form.sex = data.sex;
                    this.setting.account_form.introduce = data.introduce;
                    this.setting.account_form.website = data.website;
                    this.setting.account_form.reward = data.reward;
                    this.setting.account_form.reward_desc = data.reward_desc;
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
                    userAvatar.src=Reader.result;
                    let uid = Utils.getCookie('uid');
                    _this.$http.post('/api/user/avatar', {
                        uid: uid.substr(7,parseInt(uid.length-10)),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        baseData: Reader.result
                    }).then(res => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    });
                }, false);
            }
        },
        saveBaseFOrmSubmit:function(e, type){
            let data = {};
            switch(type){
                case 'profile':
                    data = {
                        type:type,
                        uid:this.setting.account_form.uid,
                        sex: this.setting.account_form.sex,
                        introduce: this.setting.account_form.introduce,
                        website: this.setting.account_form.website
                    }
                break;
                case 'reward':
                    data = {
                        type:type,
                        uid:this.setting.account_form.uid,
                        reward:this.setting.account_form.reward,
                        reward_desc:this.setting.account_form.reward_desc
                    }
                break;
                default:
                    data = {
                        type:type,
                        uid:this.setting.account_form.uid,
                        name:this.setting.account_form.name,
                        email:this.setting.account_form.email,
                        phone:this.setting.account_form.phone,
                        editor:parseInt(this.setting.account_form.editor)
                    }
                break;
            }
            this.$http.post('/api/user/setting/save', data).then(res=>{
                if(res.body.code && res.body.ok){
                    this.message({
                        type:'success',
                        text:'保存成功'
                    });
                }
            }).catch(err=>{
                this.message({
                    type:'error',
                    text:'保存失败'
                });
            });
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