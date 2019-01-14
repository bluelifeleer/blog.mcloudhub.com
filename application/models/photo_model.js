'use strict';
const mongoose = require('mongoose');
const photoSchema = require('../schemas/photo_schema');
module.exports = mongoose.model('Photo', photoSchema);