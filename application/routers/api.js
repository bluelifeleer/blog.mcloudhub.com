'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const express = require('express');
const md5 = require('md5');
const qrcode = require('qrcode')
const utils = require('../utils');
const WebSite = require('../models/website_model');
const User = require('../models/user_model');
const App = require('../models/app_model');
const Label = require('../models/label_model');
const Article = require('../models/article_model');
const Comment = require('../models/comment_model');
const router = express.Router();

let output = {};

router.use(function(req, res, next) {
	output = {
		code: 0,
		msg: '',
		ok: false,
		data: null
	};
	next();
});

router.post('/signin', (req, res, next) => {
	let name = req.body.name;
	let password = req.body.password;
	let checked = req.body.checked && req.body.checked === 'true' ? true : false ;
	
	if(name == ''){
		output = {
			code: 0,
			msg: '用户名不能为空',
			ok: false,
			data: null
		};
		return;
	}

	if(password == ''){
		output = {
			code: 0,
			msg: '用户密码不能为空',
			ok: false,
			data: null
		};
		return;
	}

	User.findOne({ name: name }).then(user => {
		if(user){
			if(md5(password+user.sale === user.password)){
				if(checked){
					res.cookie('checked', checked, {
						maxAge: 1800000 * 24 * 7
					});
					res.cookie('name', user.name, {
						maxAge: 1800000 * 24 * 7
					});
					res.cookie('password', user.password, {
						maxAge: 1800000 * 24 * 7
					});
				}
				res.cookie('uid', user._id, {
					maxAge: 1800000 * 24 * 7
				});
				req.session.uid = user._id;
				output = {
					code: 1,
					msg: 'success',
					ok: true,
					data: null
				};
				return;
			}else{
				output = {
					code: 0,
					msg: '密码错误',
					ok: false,
					data: null
				};
				return;
			}
		}else{
			output = {
				code: 0,
				msg: '无此用户',
				ok: false,
				data: null
			};
			return;
		}
	}).catch(err => {
		console.log(err);
		output = {
			code: 0,
			msg: '服务器出错',
			ok: false,
			data: null
		};
		return;
	});
});

router.post('/signup', (req, res, next) => {

});

router.get('/user/get', (req, res, next) => {
	res.json({
		code: 0,
		ok: true,
		message: 'success',
		data: null
	})
});

router.post('/label/add', (req, res, next) => {

});

router.post('/label/delete', (req, res, next) => {

});

router.post('/label/modify', (req, res, next) => {

});

router.get('/label/get', (req, res, next) => {

});

router.get('/label/lists', (req, res, next) => {

});

router.post('/article/add', (req, res, next) => {

});

router.post('/article/delete', (req, res, next) => {

});

router.post('/article/modify', (req, res, next) => {

});

router.get('/article/get', (req, res, next) => {

});

router.get('/article/lists', (req, res, next) => {

});

router.post('/app/add', (req, res, next) => {

});

router.post('/app/delete', (req, res, next) => {

});

router.post('/app/modify', (req, res, next) => {

});

router.get('/app/get', (req, res, next) => {

});

router.get('/app/lists', (req, res, next) => {

});

router.post('/comment/add', (req, res, next) => {

});

router.post('/comment/delete', (req, res, next) => {

});

router.post('/comment/modify', (req, res, next) => {

});

router.get('/comment/get', (req, res, next) => {

});

router.get('/comment/lists', (req, res, next) => {

});

module.exports = router;