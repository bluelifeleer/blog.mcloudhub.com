'use strict';
const express = require('express');
const router = express.Router();

router.get('/new', (req, res, next) => {
    res.render('../views/article/new', {
        title: '添加文章'
    });
});

router.get('/detaile', (req, res, next) => {
    res.render('../views/article/details', (req, res, next) => {
        title: '文章内容'
    });
});

module.exports = router;