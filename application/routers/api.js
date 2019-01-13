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
	let checked = req.body.checked;
	
	if(name == ''){
		output = {
			code: 0,
			msg: '用户名不能为空',
			ok: false,
			data: null
		};
		res.json(output);
		return;
	}

	if(password == ''){
		output = {
			code: 0,
			msg: '用户密码不能为空',
			ok: false,
			data: null
		};
		res.json(output);
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
					res.cookie('password', password, {
						maxAge: 1800000 * 24 * 7
					});
				}
				res.cookie('uid', user._id, {
					maxAge: 1800000 * 24 * 7
				});
				req.session.uid = user._id;
				req.session.name = user.name;
				output = {
					code: 1,
					msg: 'success',
					ok: true,
					data: null
				};
				res.json(output);
				return;
			}else{
				output = {
					code: 0,
					msg: '密码错误',
					ok: false,
					data: null
				};
				res.json(output);
				return;
			}
		}else{
			output = {
				code: 0,
				msg: '无此用户',
				ok: false,
				data: null
			};
			res.json(output);
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
		res.json(output);
		return;
	});
});

router.post('/signup', (req, res, next) => {
	let name = req.body.name;
	let password = req.body.password;
	let confirmPassword = req.body.confirmPassword;
	let email = req.body.email;
	
	User.findOne({name:name}).then(user=>{
		if(user){
			output = {
				code: 3,
				msg: '此用户已存在',
				ok: false,
				data: null
			};
			res.json(output);
			return;
		}else{
			let sale = utils.UUid(8)
			let nowPassword = md5(password+sale);
			new User({
				name: name,
				password: nowPassword,
				sale: sale,
				avarat: '',
				email: email,
				phone: '',
				sex: 0,
				age: 0,
				github: {},
				type: 1,   // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
				link: '',   // 用户个人连接
				deleted: false,
				date: new Date()
			}).save().then(user=>{
				if(user){
					new Label({
						uid: user._id,
						name: '随笔',
						remark: '随笔',
						logo: '',
						own: user,
						artices: [],
						deleted: false,
						date: new Date()
					}).save();
					output = {
						code: 1,
						msg: '注册成功',
						ok: true,
						data: null
					};
					res.json(output);
					return;
				}
			}).catch(err=>{
				output = {
					code: 0,
					msg: '注册失败',
					ok: false,
					data: null
				};
				res.json(output);
				return;
			})
		}
	}).catch(err=>{
		console.log(err)
	})

});

router.get('/user/get', (req, res, next) => {
	let uid = req.query.uid || req.session.uid || req.cookie.uid;
	User.findById(uid, {name: true, email: true, phone: true, avatar: true}).then(user=>{
		if(user){
			output = {
				code: 1,
				msg: 'success',
				ok: true,
				data: user
			};
			res.json(output);
			return;
		}
	}).catch(err=>{
		console.log(err);
	});
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