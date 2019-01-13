'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const md5 = require('md5');
const oauth2orize = require('oauth2orize');
const utils = require('../utils');
const server = oauth2orize.createServer();
const client = require('../models/oauth/client_model');
const user = require('../models/oauth/user_model');
const router = express.Router();

router.get('/code', (req, res, next) => {
    // server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    //     var code = utils.UUid(16);
       
    //     var ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
    //     ac.save(function(err) {
    //       if (err) { return done(err); }
    //       return done(null, code);
    //     });
    //   }));
    // console.log(res);
    let code = md5(new Date().getTime().toString());
    req.session.code = code;
    res.json({
        code: code
    })
});

router.get('/token', (req, res, next) => {

});

router.get('/authorize', (req, res, next) => {

});

module.exports = router;