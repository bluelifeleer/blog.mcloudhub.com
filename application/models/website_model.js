'use strict';
/**
 * 网站设置 model
 */
const mongoose = require('mongoose');
const websiteSchema = require('../schemas/website_schema');
module.exports = mongoose.model('WebSite', websiteSchema);