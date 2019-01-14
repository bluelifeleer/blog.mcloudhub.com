'use strict';
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    user_id: String,
    own:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    originalname: String,
    filename: String,
    path: String,
    fullpath: String,
    encoding: String,
    mimetype: String,
    size: Number,
    width: Number,
    height: Number,
    date: Date,
    deleted: Boolean
});