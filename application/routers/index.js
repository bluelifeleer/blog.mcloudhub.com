'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('../views/index', {
        title: '首页'
    });
});

router.get('/login', (req, res, next) => {
    res.render('../views/login', {
        title: '登录'
    });
});

router.get('/register', (req, res, next) => {
    res.render('../views/register', {
        title: '注册'
    });
});

router.get('/app', (req, res, next) => {
    res.render('../views/app', {
        title: '添加应用'
    })
});

router.get('/qrcode', (req, res, next) => {
    res.render('../views/qrcode', {
        title: '二维码应用'
    });
});

router.get('/tools', (req, res, next) => {
    res.render('../views/tools', {
        title: '在线工具'
    });
});

router.get('/canvas', (req, res, next) => {
    res.render('../views/canvas', {
        title: 'canvas'
    });
});

module.exports = router;