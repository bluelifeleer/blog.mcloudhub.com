'use strict';
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    name: { type: String },
    id: {type: String, required: true},
    userId: {type: String, required: true},
    secret: { type: String, required: true },
    scopes: [{ type: String, default: [] }],
    grants: [{ type: String, required: true }],
    redirectUris: [{ type: String, default: [] }],
    accessTokenLifetime: { type: Number, default: 3600 },
    refreshTokenLifetime: { type: Number, default: 1209600 },
    isActive: { type: Boolean, default: true, index: true },
    timestamps: Boolean
});