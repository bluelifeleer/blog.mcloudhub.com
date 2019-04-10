'use strict';
/**
 * 用户 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	name: String,
	password: String,
	sale: String,
	avatar: String,
	email: String,
	phone: String,
	sex: Number,
	age: Number,
	github_id: String,
	github: {},
	introduce: String,
	keyWord: 0,
	follow: 0,
	follows: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	heart: Number, // 喜欢的文章
    hearts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
	}],
	collect: Number, // 收藏的文章
    collects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
	}],
	comment: Number,
    comments: [{ // 评论的文章
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
	}],
	follow: Number, // 转发的文章
    follows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
	}],
	share: Number, // 分享的文章
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
	}],
	read: Number, // 阅读的文章
    reads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    }],
	editor: Number, // 编辑器，支持1：Editor.md；0：wangEditor
	type: Number, // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
	link: String, // 用户个人连接
	website:String, // 用户网站
	reward: Number,
	reward_desc: String,
	deleted: Boolean,
	date: Date,
	has_tag: Boolean
});
