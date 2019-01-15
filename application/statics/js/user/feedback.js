const VUE = new Vue({
    delimiters: ['${', '}'],
    el: '#app',
    data:{
        showUserProfile: false,
        user: {
            name: '',
            phone: '',
            email: '',
            editor: 1,
            avatar: '',
            href: ''
        }
    },
    created(){},
    methods:{
        init: function(){
            if (Utils.getCookie('uid')) {
                this.getUser();
            }
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
    mounted(){
        this.init();
    }
});