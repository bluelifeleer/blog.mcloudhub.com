const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const userSchema = require('../../schemas/oauth/user_schema');
module.exports = mongoose.model('user', userSchema);