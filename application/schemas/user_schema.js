'use strict';
/**
 * 用户 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    name: String,
    password: String,
    sale: String,
    avarat: String,
    email: String,
    phone: String,
    sex: Number,
    age: Number,
    github: {},
    type: Number,   // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
    link: String,   // 用户个人连接
    deleted: Boolean,
    date: Date
});