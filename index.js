'use strict';
/*
 * 项目入口
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const express = require('express');
const httpConcat = require('http-concat');
const debug = require('debug')('blog:server')
const supportsColor = require('supports-color');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const http = require('http');
//引入http2模块
const http2 = require('spdy');
const SocketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet')
const swig = require('swig');
const config = require(path.join(__dirname, '/application/config'));
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const sillyDateTime = require('silly-datetime');
const serveIndex = require('serve-index');
const uuidv4 = require('uuid/v4');
const expressRequestId = require('express-request-id')();
const expressCurl = require('express-curl');
const md5 = require('md5');
const colors = require('colors');
const winston = require('winston');
const expressWinston = require('express-winston');
const errorhandler = require('errorhandler');
const notifier = require('node-notifier');
const flash = require('flash');
const webp = require('webp-converter');
const app = express();
const platform = os.platform();
//是否启动记录访问日志
const start_log = true;

let ssloptions = {
    key: fs.readFileSync(path.join(__dirname + '/ssl/blog.mcloudhub.com.key')),
    cert: fs.readFileSync(path.join(__dirname + '/ssl/blog.mcloudhub.com.pem'))
};

//设置模板引擎
app.engine('html', swig.renderFile);
//  设置模板路径
app.set('views', path.join(__dirname, '/application/views'));
// 注册模板
app.set('view engine', 'html');
// 不保存视图缓存
app.set('view cache', false);
// 将模板缓存设置false
swig.setDefaults({
    cache: false
});
// 设置request id
app.use(expressRequestId);
// extends设置true表示接收的数据是数组，false表示是字符串
app.use(bodyParser.urlencoded({
    extended: true
}));
// 将提交的数据转成json,并且设置请求实体大小
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(cookieParser('session_id', {
    maxAge: 1200000,
    secure: true
}));

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'blog',
    collection: 'sessions',
    useNewUrlParser: true
}, err => {
    if (err) throw err;
});

store.on('error', error => {
    assert.ifError(error);
    assert.ok(false);
});

app.use(session({
    genid: function(req) {
        return uuidv4(); // use UUIDs for session IDs
    },
    secret: 'session_id', // 与cookieParser中的一致
    resave: true,
    store: store, // 将session保存到mongodb中
    saveUninitialized: false, // 是否保存未初始化的session
    cookie: {
        secure: true,
        maxAge: 1200000, // 设置session、cookie有效时间20分钟
    },
    rolling: true
}));

// 服务器启动时默认配置/动作
app.use(function(req, res, next) {
    if (req.session) {
        // //将登录后的用户信息附加到request头信息中
        if (req.cookies.uid && req.cookies.uid != '') {
            try {
                req.session.uid = req.cookies.uid;
            } catch (e) {
                console.log(e);
            }
        }
        // 将系统类型添加到cookies和请求头中;
        // os.platform return now node runing systems : darwin=>MAC win32=>windows
        res.cookie('platform', platform);
        req.session.platform = platform;
        req.platform = platform;
    } else {
        return next(new Error('oh no')) // handle error
    }
    next();
});

app.use(helmet());
app.use(cors());
app.use(csurf({
    cookie: true,
    ignoreMethods: ['GET', 'POST']
}));
app.use(function(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    } else {
        // handle CSRF token errors here
        res.status(403);
        res.send('form tampered with');
    }

});

app.use(expressWinston.logger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs/error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs/combined.log')
        })
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function(req, res) {
            return false;
        } // optional: allows to skip some log messages based on request and/or response
}));

// 记录访问日志
if (start_log) {
    const logDirectory = path.join(__dirname, 'logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // 日志目录不存在创建目录
    const logerFile = 'access_' + sillyDateTime.format(new Date(), 'YYYY_MMM_DD') + '.log';
    const accessLogStream = rfs(logerFile, {
        interval: '1d', // 日志切割间隔为1天，以s,m,h,d为单位
        path: logDirectory, // 日志保存路径，
        size: '1M', // 单个日志文件的大小，以B,K,M,G为单位
        compress: true // 压缩日志
    });
    app.use(morgan('combined', {
        stream: accessLogStream
    }));
}

// 设置ftp路由
app.use('/ftp', express.static(path.join(__dirname, '/application/ftp')), serveIndex(path.join(__dirname, '/application/ftp'), {
    'icons': true
}));
app.use('/root.txt', express.static(path.join(__dirname, 'root.txt')));
app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')));
app.use(httpConcat({
    base: path.join(__dirname, 'public'),
    path: '/'
}));

//设置静态文件托管
app.use('/static', express.static(path.join(__dirname, '/application/statics')));
app.use('/download', express.static(path.join(__dirname, '/application/download')));
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));

// 定义路由www
app.use('/', require(path.join(__dirname, '/application/routers/index')));
app.use('/oauth', require(path.join(__dirname, 'application/routers/oauth')));
app.use('/api', require(path.join(__dirname, '/application/routers/api')));
app.use('/article', require(path.join(__dirname, '/application/routers/article')));
app.use('/user', require(path.join(__dirname, '/application/routers/user')));
app.use('/captcha', require(path.join(__dirname, '/application/routers/captcha')));
app.use('/other', require(path.join(__dirname, '/application/routers/other')));

// 处理404请求
app.get('*', (req, res) => {
    res.render(path.join(__dirname, '/application/views/404'), {
        title: 'No Found'
    });
});

// console.log(process.env.NODE_ENV)
// 设置开发环境
// 1：window
// 		set NODE_ENV=development
// 2：linux
// 		export NODE_ENV=development

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler({
        log: errorNotification
    }));
}

function errorNotification(err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url
    notifier.notify({
        title: title,
        message: str
    });
}

//连接数据库
mongoose.connect('mongodb://127.0.01:27017/blog', {
    useNewUrlParser: true
}, (err, res) => {
    if (err) {
        console.log(err);
        notifier.notify({
            title: 'blog.mcloudhub.com',
            message: 'this MongoDB connection failed !'
        });
    } else {
        // 数据库连接成功后监听80/443端口
        // if (platform.toLowerCase() == 'darwin' || platform.toLowerCase() == 'win32') {
            app.listen(80);
            const server = http2.createServer(ssloptions, app);
            server.listen(443);
            const SocketServer = new SocketIO(server);
            SocketServer.on('connection', (socket, err) => {
                console.log(socket);
                console.log(err);
            });
            notifier.notify({
                title: 'blog.mcloudhub.com',
                message: 'the server started . http server listener port 80 https server listener port 443 .'
            });
        // } else {
        //     app.listen(3002);
        //     notifier.notify({
        //         title: 'blog.mcloudhub.com',
        //         message: 'the server started . http server listener port 3002 .'
        //     });
        // }
    }
});

module.exports = app;