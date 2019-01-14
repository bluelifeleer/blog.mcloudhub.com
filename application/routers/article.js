'use strict';
const express = require('express');
const router = express.Router();

router.get('/new', (req, res, next) => {
    let redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.session.uid && req.cookies.uid) {
        res.render('../views/article/new', {
            platform: req.platform ? req.platform : (req.cookies.get('platform') ? req.cookies.get('platform') : ''),
            uid: req.session.uid && req.cookies.uid,
            page_type: 'editor',
        });
    } else {
        res.redirect(302, '/login?redirect_uri=' + redirect_uri);
    }
});

router.get('/detaile', (req, res, next) => {
    res.render('../views/article/details', (req, res, next) => {
        title: '文章内容'
    });
});

module.exports = router;