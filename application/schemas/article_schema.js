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
    label: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
    },
    heart: Number, // 喜欢
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
    share: Number, // 分享数
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comment: Number,
    commentsOwn: [{ // 文章评论作者
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{ // 文章评
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    read: Number, // 文章阅读
    reads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    KeyWords: Number, // 文章字数
    virtualLink: String, // 文章虚拟连接
    trueLink: String, // 真实连接
    qrcode: String, // 文章唯一二维码
    type: Number, // 文章使用编辑器类型，1：Editor.md；0：wangEditor；
    permission: Number, // 文章权限，0：公开；1：私有的
    deleted: Boolean,
    date: Date, // 文章创建时间
    updateTime: Date // 文章修改时间
});