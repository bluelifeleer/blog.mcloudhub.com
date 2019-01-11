'use strict';
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    username: { type: String, unique: 1 },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    
    timestamps: Boolean
});