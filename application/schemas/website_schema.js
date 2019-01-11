'use strict';
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
            background: String
        }]
    }
});