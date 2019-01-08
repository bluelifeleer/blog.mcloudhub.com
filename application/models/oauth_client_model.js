'use strict';
const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const { intersection } = require('lodash');
const OauthClientClient = require('../schemas/oauth_client_schema');
module.exports = mongoose.model('OauthClient', OauthClientClient);

// OAuthClientSchema.plugin(mongooseBcrypt, {
//     fields: ['secret'],
//     rounds: 12
// });

// OAuthClientSchema.query.active = function() {
//     return this.where({ isActive: true });
// };

// OAuthClientSchema.statics.getUserFromClient = function(client) {
//     return String(client.id || client._id);
// };

// OAuthClientSchema.statics.validateScope = function(user, client, scope = '') {
//     let validScopes = [];

//     if (typeof client.scopes === 'undefined') {
//         return 'UNSUPPORTED'; // Returning `undefined` would trigger an invalid scope error
//     } else if (typeof client.scopes === 'string') {
//         validScopes = client.scopes.split(' ');
//     } else if (Array.isArray(client.scopes)) {
//         validScopes = client.scopes;
//     } else {
//         throw new Error('client.scopes must be a string or an array');
//     }

//     return intersection(scope.split(' '), validScopes).join(' ');
// };

// module.exports = (db) => db.model('OAuthClient', OAuthClientSchema);
