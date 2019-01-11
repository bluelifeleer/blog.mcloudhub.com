'use strict';
/**
 * 文章 model
 */
const mongoose = require('mongoose');
const articleSchema = require('../schemas/article_schema');
mondule.exports = mongoose.model('Article', articleSchema);