const VUE = new Vue({
	delimiters: ['${', '}'],
	el: '#app',
	data: {
		searchBlur: false,
		showUserProfile: false,
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
			size: 1,
			num: 20,
			list: []
		}
	},
	created() {},
	methods: {
		init: function() {
			if (Utils.getCookie('uid')) {
				this.getUser();
			}
			this.getArticles();
		},
		getUser: function() {
			let uid = Utils.getCookie('uid');
			this.$http.get('/api/user/get?id=' + uid).then(res => {
				if (res.body.code && res.body.ok) {
					let data = res.body.data;
					data.href = '/user/profile?id=' + data._id;
					this.user = data;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		searchBlurListener: function() {
			this.searchBlur = true;
		},
		showUserProfileToggle: function(e) {
			this.showUserProfile = !this.showUserProfile;
		},
		getArticles: function() {
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
						item.nowTitle = item.title.length >= 70 ? (item.title.substr(0, 70) + '....') : item.title;
						item.href = '/article/detaile?id=' + item._id;
						item.own.href = '/user/profile?id=' + item.own._id;
						item.updateTime = Utils.formateDate(item.updateTime)
					});
					this.articles.count = data.count;
					this.articles.size = data.size;
					this.articles.num = data.num;
					this.articles.list = data.list;
				}
			}).catch(err => {
				console.log(err)
			})
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
