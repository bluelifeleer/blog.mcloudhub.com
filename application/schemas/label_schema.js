'use strict';
/**
 * 文章标签 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    uid: String,
    name: String,
    remark: String,
    logo: String,
    own: { // 标签所属者
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    articles: [{ // 标签下的文章
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    }],
    permission: String,// 权限，‘public’:公开，‘private’:私有
    deleted: Boolean,
    date: Date
});