'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/profile', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/user/profile', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-profile',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/collect', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/user/collect', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-collect',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/heart', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/user/heart', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-heart',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/set', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/user/set', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-set',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/feedback', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/user/feedback', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-feedback',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

module.exports = router;