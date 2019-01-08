'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('../views/index', {
        title: 'index'
    })
});

module.exports = router;