'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const sillyDateTime = require('silly-datetime');
const User = require('../models/user_model');
const Label = require('../models/label_model');
const Article = require('../models/article_model');
const config = require(path.join(__dirname, '../config'));
const rp = require('request-promise');
const now = new Date();
let output = {};
const router = express.Router();

router.use(function(req, res, next) {
    output = {
        code: 0,
        msg: '',
        ok: false,
        data: null
    };
    next();
});

router.get('/loginin', (req, res, next)=>{
    let type = req.query.type;
    let state = now.getTime();
    req.session.state = state;
    let client_id = '';
    let redirect_uri = '';
    switch(type){
        case 'github':
            client_id = config.github.client_id;
            redirect_uri = config.github.redirect_uri;
        break;
        case 'sina':
        break;
        case 'wetch':
        break;
        case 'qq':
        break;
        default:
        break;
    }
    res.json({
        code: 1,
        ok: true,
        message: '',
        data: {
            client_id: client_id,
            redirect_uri: redirect_uri,
            state: state
        }
    });
});

router.get('/github', (req, res, next) => {
    let code = req.query.code;
    let state = req.query.state;
    let access_token_opations = {
        uri: 'https://github.com/login/oauth/access_token',
        qs: {
            client_id: config.github.client_id,
            client_secret: config.github.client_secret,
            code: code,
            redirect_uri: config.github.redirect_uri,
            state: state,
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    }
    rp(access_token_opations).then(token=>{
        // console.log(token)
        let user_opations = {
            uri: 'https://api.github.com/user',
			headers: {
				'User-Agent': 'Request-Promise',
				'Authorization': 'token ' + token.access_token,
			},
			json: true
        }
        rp(user_opations).then(github=>{
            // console.log(user)
            User.findOne({github_id: github.id}).then(user=>{
                if(!user){
                    new User({
                        name: github.name,
                        password: '',
                        sale: '',
                        avatar: github.avatar_url,
                        email: github.email,
                        phone: '',
                        sex: 0,
                        age: 0,
                        github_id: github.id,
                        github: github,
                        type: 6, // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
                        editor: 1,
                        link: '', // 用户个人连接
                        website: github.blog,
                        keyWord: 0,
                        follow: 0,
                        follows: [],
                        "heart":0,
                        "hearts":[],
                        "collect":0,
                        "collects":[],
                        "comment":0,
                        "comments":[],
                        "follow":0,
                        "follows":[],
                        "share":0,
                        "shares":[],
                        "read":0,
                        "reads":[],
                        deleted: false,
                        date: now
                    }).save().then(users=>{
                        if (users) {
                            new Label({
                                uid: users._id,
                                name: '随笔',
                                remark: '随笔',
                                logo: '',
                                own: users,
                                artices: [],
                                deleted: false,
                                date: now
                            }).save().then(label => {
                                new Article({
                                    uid: users._id,
                                    labelId: label._id,
                                    title: sillyDateTime.format(now, 'YYYY-MMM-DD HH:mm:ss'),
                                    content: '',
                                    own: users,
                                    label: label,
                                    heart: 0,
                                    follow: 0,
                                    collect: 0,
                                    share: 0,
                                    comment: 0,
                                    read: 0,
                                    KeyWords: 0,
                                    deleted: false,
                                    date: now,
                                    updateTime: now
                                }).save().then(article => {
                                    label.articles.push(article);
                                    label.save();
                                    res.cookie('uid', users._id, {
                                        maxAge: 1200000
                                    });
                                    req.session.uid = users._id;
                                    req.session.name = users.name;
                                    res.redirect('https://blog.mcloudhub.com');
                                }).catch(err => {
                                    console.log(err);
                                    output = {
                                        code: 0,
                                        msg: 'error',
                                        ok: false,
                                        data: null
                                    };
                                    res.json(output);
                                    return;
                                })
                            }).catch(err => {
                                console.log(err);
                                output = {
                                    code: 0,
                                    msg: 'error',
                                    ok: false,
                                    data: null
                                };
                                res.json(output);
                                return;
                            });
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    res.cookie('uid', user._id, {
                        maxAge: 1200000
                    });
                    req.session.uid = user._id;
                    req.session.name = user.name;
                    res.redirect('https://blog.mcloudhub.com');
                }
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
});

module.exports = router;