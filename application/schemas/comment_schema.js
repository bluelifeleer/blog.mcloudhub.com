'use strict';
/**
 * 文章评论 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    uid: String,
    labelId: String,
    articleId: String,
    content: String,
    own: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    },
    replys: [
        {
            uid: String,
            name: String,
            avatar: String,
            comment: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            comment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            }
        }
    ],
    heart: Number,
    hearts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    deleted: Boolean,
    date: Date
});