'use strict';
const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const { intersection } = require('lodash');
const clientSchema = require('../../schemas/oauth/client_schema');

clientSchema.plugin(mongooseBcrypt, {
    fields: ['secret'],
    rounds: 12
});

clientSchema.query.active = function() {
    return this.where({ isActive: true });
};

clientSchema.statics.getUserFromClient = function(client) {
    return String(client.id || client._id);
};

clientSchema.statics.validateScope = function(user, client, scope = '') {
    let validScopes = [];

    if (typeof client.scopes === 'undefined') {
        return 'UNSUPPORTED'; // Returning `undefined` would trigger an invalid scope error
    } else if (typeof client.scopes === 'string') {
        validScopes = client.scopes.split(' ');
    } else if (Array.isArray(client.scopes)) {
        validScopes = client.scopes;
    } else {
        throw new Error('client.scopes must be a string or an array');
    }

    return intersection(scope.split(' '), validScopes).join(' ');
};

module.exports = mongoose.model('client', clientSchema);

// module.exports = (db) => db.model('OAuthClient', OAuthClientSchema);
