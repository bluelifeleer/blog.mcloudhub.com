'use strict';
/**
 * 应用 schema
 */
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    uid: String,
    name: String,
    appKey: String,
    secret: String,
    redirectUris: String,
    logo: String,
    timestamps: Boolean,
    deleted: Boolean,
    date: Date
});