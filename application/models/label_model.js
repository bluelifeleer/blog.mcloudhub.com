'use strict';
/**
 * 标签 model
 */
const mongoose = require('mongoose');
const labelSchema = require('../schemas/label_schema');
mondule.exports = mongoose.model('Label', labelSchema);