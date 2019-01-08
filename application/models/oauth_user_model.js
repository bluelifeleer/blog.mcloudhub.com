const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const OauthUserSchema = require('../schemas/oauth_user_schema');
module.exports = mongoose.model('OauthUser', OauthUserSchema);