'use strict';
/**
 * 网站 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    uid: String,
    width: Number,
    height: Number,
    background: String,
    header:{
        width: Number,
        height: Number,
        background: String,
        navs: [{
            name: String,
            url: String,
            icon: String,
            background: String,
            target: String  // 连接打开方式，_blank,_parent,_self,_top, default: _self.
        }]
    }
});