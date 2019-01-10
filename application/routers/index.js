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
})

router.get('/register', (req, res, next) => {
	res.render('../views/register', {
		title: '注册'
	});
})


module.exports = router;
