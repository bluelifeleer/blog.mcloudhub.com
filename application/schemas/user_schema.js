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
    github: {},
    keyWord: 0,
    follow: 0,
    follows: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    editor: Number, // 编辑器，支持1：Editor.md；0：wangEditor
    type: Number, // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
    link: String, // 用户个人连接
    deleted: Boolean,
    date: Date
});