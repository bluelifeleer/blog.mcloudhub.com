'use strict';
/**
 * 用户 model
 */
const mongoose = require('mongoose');
const userSchema = require('../schemas/user_schema');
module.exports = mongoose.model('User', userSchema);