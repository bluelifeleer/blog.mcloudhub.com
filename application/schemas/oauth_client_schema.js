'use strict';
const mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    name: { type: String },
    secret: { type: String, required: true },
    scopes: [{ type: String, default: [] }],
    grants: [{ type: String, required: true }],
    redirectUris: [{ type: String, default: [] }],
    accessTokenLifetime: { type: Number, default: 3600 },
    refreshTokenLifetime: { type: Number, default: 1209600 },
    isActive: { type: Boolean, default: true, index: true }
}, {
    timestamps: true,
    toObject: {
        getters: true,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.secret;
            return ret;
        }
    }
})