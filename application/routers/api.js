'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const express = require('express');
const md5 = require('md5');
const qrcode = require('qrcode');
const sillyDateTime = require('silly-datetime');
const multer = require('multer');
const imageSize = require('image-size');
const utils = require('../utils');
const WebSite = require('../models/website_model');
const User = require('../models/user_model');
const App = require('../models/app_model');
const Label = require('../models/label_model');
const Article = require('../models/article_model');
const Comment = require('../models/comment_model');
const Photo = require('../models/photo_model');
const uoloader = multer(); //{dest: 'uploads/'}设置dest表示上传文件的目录，如果不设置上传的文件永远在内存之中不会保存到磁盘上。在此处为了在内存中取出文件并重命名所以不设置文件上传路径
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

    if (name == '') {
        output = {
            code: 0,
            msg: '用户名不能为空',
            ok: false,
            data: null
        };
        res.json(output);
        return;
    }

    if (password == '') {
        output = {
            code: 0,
            msg: '用户密码不能为空',
            ok: false,
            data: null
        };
        res.json(output);
        return;
    }

    User.findOne({
        name: name
    }).then(user => {
        if (user) {
            if (md5(password + user.sale === user.password)) {
                if (checked) {
                    res.cookie('checked', checked, {
                        maxAge: 1200000
                    });
                    res.cookie('name', user.name, {
                        maxAge: 1200000
                    });
                    res.cookie('password', password, {
                        maxAge: 1200000
                    });
                }
                res.cookie('uid', user._id, {
                    maxAge: 1200000
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
            } else {
                output = {
                    code: 0,
                    msg: '密码错误',
                    ok: false,
                    data: null
                };
                res.json(output);
                return;
            }
        } else {
            output = {
                code: 2,
                msg: '无此用户',
                ok: true,
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

router.get('/signout', (req, res, next) => {
    res.clearCookie('uid'); // 清除cookie中的uid
	req.session.destroy(() => { // 销毁session中的uid
		output = {
            code: 1,
            msg: 'success',
            ok: true,
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
    let now = new Date();

    if(password != confirmPassword){
        output = {
            code: 2,
            msg: '再次输入密码不同',
            ok: true,
            data: null
        };
        res.json(output);
        return;
    }

    User.findOne({
        name: name
    }).then(user => {
        if (user) {
            output = {
                code: 3,
                msg: '此用户已存在',
                ok: true,
                data: null
            };
            res.json(output);
            return;
        } else {
            let sale = utils.UUid(8)
            let nowPassword = md5(password + sale);
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
                type: 1, // 注册方式，1：用户名，2：手机号，3：邮箱，4：QQ，5：微信，6：github.
                editor: 1,
                link: '', // 用户个人连接
                deleted: false,
                date: now
            }).save().then(user => {
                if (user) {
                    new Label({
                        uid: user._id,
                        name: '随笔',
                        remark: '随笔',
                        logo: '',
                        own: user,
                        artices: [],
                        deleted: false,
                        date: now
                    }).save().then(label => {
                        new Article({
                            uid: user._id,
                            labelId: label._id,
                            title: sillyDateTime.format(now, 'YYYY-MMM-DD HH:mm:ss'),
                            content: '',
                            own: user,
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
                            output = {
                                code: 1,
                                msg: '注册成功',
                                ok: true,
                                data: null
                            };
                            res.json(output);
                            return;
                        }).catch(err => {
                            console.log(err);
                        })
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }).catch(err => {
                console.log(err)
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
    }).catch(err => {
        console.log(err)
    })

});

router.get('/user/get', (req, res, next) => {
    let uid = req.query.uid || req.session.uid || req.cookies.uid;
    User.findById(uid, {
        name: true,
        email: true,
        phone: true,
        avatar: true,
        editor: true
    }).then(user => {
        if (user) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: user
            };
            res.json(output);
            return;
        }
    }).catch(err => {
        console.log(err);
    });
});

router.post('/label/add', (req, res, next) => {
    let uid = req.body.uid || req.secure.uid || req.cookies.uid;
    let name = req.body.name;
    let now = new Date();
    User.findById(uid).then(user => {
        if (user) {
            new Label({
                uid: user._id,
                name: name,
                remark: '',
                logo: '',
                own: user,
                articles: [],
                deleted: false,
                date: now
            }).save().then(label => {
                if (label) {
                    new Article({
                        uid: user._id,
                        labelId: label._id,
                        title: sillyDateTime.format(now, 'YYYY-MMM-DD HH:mm:ss'),
                        content: '',
                        own: user,
                        label: label,
                        heart: 0,
                        follow: 0,
                        collect: 0,
                        share: 0,
                        comment: 0,
                        read: 0,
                        KeyWords: 0,
                        type: 1,
                        permission: 0,
                        deleted: false,
                        date: now,
                        updateTime: now
                    }).save().then(article => {
                        label.articles.push(article);
                        label.save();
                        output = {
                            code: 1,
                            msg: 'success',
                            ok: true,
                            data: user
                        };
                        res.json(output);
                        return;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }).catch(err => {
        console.log(err);
    })
});

router.post('/label/delete', (req, res, next) => {

});

router.post('/label/modify', (req, res, next) => {

});

router.get('/label/get', (req, res, next) => {

});

router.get('/label/lists', (req, res, next) => {
    let uid = req.query.uid || '';
    let count = parseInt(req.query.count) || 0;
    let num = parseInt(req.query.num) || 10;
    let size = parseInt(req.query.size) || 1;
    Label.countDocuments({
        deleted: false
    }, (err, count) => {
        Label.find({
            uid: uid,
            deleted: false
        }).populate([{
            path: 'own',
            select: 'name'
        }, {
            path: 'articles',
            select: 'uid labelId title content markDown html permission'
        }, {
            path: 'label',
            select: 'name'
        }]).skip(parseInt(num * (size - 1))).limit(num).then(labels => {
            if (labels) {
                output = {
                    code: 1,
                    msg: 'success',
                    ok: true,
                    data: {
                        count: count,
                        size: size,
                        num: num,
                        list: labels
                    }
                };
                res.json(output);
                return;
            }
        }).catch(err => {
            console.log(err);
        })
    });
});

router.post('/article/add', (req, res, next) => {
    let uid = req.body.uid || req.secure.uid || req.cookies.uid;
    let labelId = req.body.labelId;
    let title = req.body.title;
    let type = req.body.type;
    User.findById(uid).then(user => {
        let label = Label.findById(labelId);
        return Promise.all([user, label]);
    }).spread((user, label) => {
        new Article({
            uid: user._id,
            labelId: label._id,
            title: title,
            content: '',
            markDown: '',
            html: '',
            own: user,
            label: label,
            heart: 0, // 喜欢
            hearts: [],
            follow: 0, // 转发
            follows: [],
            collect: 0, // 收藏
            collects: [],
            share: 0, // 分享数
            shares: [],
            comment: 0,
            comments: [],
            read: 0, // 文章阅读
            reads: [],
            KeyWords: 0, // 文章字数
            virtualLink: '', // 文章虚拟连接
            trueLink: '', // 真实连接
            qrcode: '', // 文章唯一二维码
            type: type,
            permission: 0,
            deleted: false,
            date: new Date(), // 文章创建时间
            updateTime: new Date() // 文章修改时间
        }).save().then(status => {
            label.articles.push(status);
            label.save();
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: null
            };
            res.json(output);
            return;
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
});

router.post('/article/delete', (req, res, next) => {

});

router.post('/article/modify', (req, res, next) => {
    let id = req.body.id;
    let title = req.body.title;
    Article.findByIdAndUpdate(id, {
        title: title
    }, {
        new: true,
        runValidators: true
    }).then(status => {
        if (status) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: null
            };
            res.json(output);
            return;
        } else {
            output = {
                code: 0,
                msg: 'error',
                ok: false,
                data: null
            };
            res.json(output);
            return;
        }
    }).catch(err => {
        console.log(err);
    })
});

router.get('/article/get', (req, res, next) => {
    let id = req.query.id;
    Article.findById(id).populate([{
        path: 'own',
        select: 'name avatar'
    }, {
        path: 'label',
        select: 'name'
    }]).then(article => {
        if (article) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: {
                    article: article
                }
            };
            res.json(output);
            return;
        }
    }).catch(err => {
        console.log(err);
    })
});

router.get('/article/lists', (req, res, next) => {
    let count = parseInt(req.query.count) || 0;
    let size = parseInt(req.query.size) || 1;
    let num = parseInt(req.query.num) || 10;
    Article.countDocuments({
        deleted: false
    }, (err, count) => {
        if (err) {
            console.log(err)
        } else {
            Article.find({
                deleted: false
            }, {
                title: true,
                content: true,
                uid: true,
                labelId: true,
                heart: true,
                own: true,
                follow: true,
                collect: true,
                share: true,
                comment: true,
                read: true,
                updateTime: true,
                type: true,
                permission: true,
            }).skip(num * (size - 1)).limit(num).populate([{
                path: 'own',
                select: 'name avatar'
            }]).then(articles => {
                if (articles) {
                    output = {
                        code: 1,
                        msg: 'success',
                        ok: true,
                        data: {
                            count: count,
                            size: size,
                            num: num,
                            list: articles
                        }
                    };
                    res.json(output);
                    return;
                } else {
                    output = {
                        code: 0,
                        msg: 'error',
                        ok: false,
                        data: null
                    };
                    res.json(output);
                    return;
                }
            }).catch(err => {
                console.log(err)
            })
        }
    });
});

router.post('/article/save', (req, res, next) => {
    let id = req.body.id;
    let content = req.body.content;
    let html = req.body.html;
    let markDown = req.body.markDown;
    Article.findByIdAndUpdate(id, {
        content: content,
        html: html,
        markDown: markDown,
        KeyWords: content.length,
        updateTime: new Date()
    }, {
        new: true,
        runValidators: true
    }).then(status => {
        if (status) {
            output = {
                code: 1,
                msg: 'success',
                ok: true,
                data: null
            };
            res.json(output);
            return;
        } else {
            output = {
                code: 0,
                msg: 'error',
                ok: false,
                data: null
            };
            res.json(output);
            return;
        }
    }).catch(err => {
        console.log(err);
    })
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

router.post('/file/uploader', uoloader.single('editormd-image-file'), (req, res, next) => {
    let uid = req.session.uid && req.cookies.uid;
    let ext = req.file.mimetype.split('/')[1];
    let now = new Date();
    let filename = sillyDateTime.format(now, 'YYYYMMMDDHHmmss') + '_' + md5(now.getTime().toString()) + '.' + ext;
    let now_timer = sillyDateTime.format(now, 'YYYYMMMDD');
    // let dirname = '/home/wwwroot/node/blog.mcloudhub.com/app/public/images/uploads/' + now_timer + '/';
    // let dirname = '/home/wwwroot/node/blog.mcloudhub.com/app/public/images/uploads/'+ now_timer + '/';
    let dirname = '/Users/bluelifeleer/www/node/blog.mcloudhub.com/application/statics/images/uploads/' + now_timer + '/';
    // let dirname = 'C:/web/www/node/blog.mcloudhub.com/application/statics/images/uploads/' + now_timer + '/';
    fs.existsSync(dirname) || fs.mkdirSync(dirname); // 目录不存在创建目录
    fs.writeFile(dirname + filename, req.file.buffer, err => {
        if (!err) {
            // util
            // 计算上传的图片宽度和高度
            let dimensions = imageSize(dirname + filename); // 使用绝对路径，也可以使用url，使用url要转换成buffer
            let width = dimensions.width;
            let height = dimensions.height;
            User.findById(uid).then(user => {
                new Photo({
                    user_id: user._id,
                    own: user,
                    originalname: req.file.originalname,
                    filename: filename,
                    path: dirname,
                    fullpath: dirname + filename,
                    encoding: req.file.encoding,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    width: width,
                    height: height,
                    date: new Date(),
                    deleted: 0
                }).save().then(insert => {
                    if (!insert) throw console.log(insert);
                    res.json({
                        message: '图片上传成功',
                        url: 'https://blog.mcloudhub.com/static/images/uploads/' + now_timer + '/' + filename + '?w=' + width + '&h=' + height,
                        success: 1
                    });
                });
            });
        }
    });
});

module.exports = router;