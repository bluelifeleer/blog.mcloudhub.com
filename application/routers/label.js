'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/articles', (req, res, next) => {
    res.render('../views/label/index', {
        title: '标签列表'
    });
});

module.exports = router;