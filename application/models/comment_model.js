'use strict';
/**
 * 评论 model
 */
const mongoose = require('mongoose');
const commentSchema = require('../schemas/comment_schema');
module.exports = mongoose.model('Comment', commentSchema);