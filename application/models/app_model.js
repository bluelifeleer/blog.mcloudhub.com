'use strict';
/**
 * 应用 model
 */
const mongoose = require('mongoose');
const appSchema = require('../schemas/app_schema');
module.exports = mongoose.model('App', appSchema);