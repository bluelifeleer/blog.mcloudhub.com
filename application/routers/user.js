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
            title: '我的主页',
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
            title: '我收藏的文章',
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
            title: '我喜欢的文章',
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
            title: '设置',
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
            title: '问题志反馈',
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'user-feedback',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/label', (req, res, next) => {
    res.render('../views/user/label', {
        title: '标签',
        platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
        uid: req.session.uid && req.cookies.uid,
        page_type: 'user-label',
    });
});

module.exports = router;