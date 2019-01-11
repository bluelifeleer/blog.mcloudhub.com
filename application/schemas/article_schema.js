'use strict';
/**
 * 文章 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    uid: String,
    labelId: String,
    title: String,
    content: String,
    markDown: String,
    html: String,
    own: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    heart: Number,  // 喜欢
    hearts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    follow: Number, // 转发
    follows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    collect: Number, // 收藏
    collects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    share: Number,  // 分享数
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comment: Number,
    comments: [{    // 文章评论数
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    KeyWords: Number,   // 文章字数
    deleted: Boolean,
    date: Date, // 文章创建时间
    updateTime: Date // 文章修改时间
});