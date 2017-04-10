/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-04-10 20:53
#
# Description:	
#
=============================================================================*/

'use strict';

const Router = require('koa-router');
const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const { jwt_secret, accounts } = require('../config');
const { PARAM_EXCRPTION, UNAUTHORIZED_EXCEPTION } = require('../exceptions');

module.exports = new Router()

.post('/', ctx => {
    const body = ctx.request.body;

    if (Object.keys(body).length != 2
        || !Reflect.has(body, 'account')
        || !Reflect.has(body, 'passwd'))
        throw PARAM_EXCRPTION.new();

    let { account, passwd } = body;
    passwd = sha1(passwd);
    if (accounts.findIndex(item =>
        item.account === account && item.passwd === passwd) >= 0)
        ctx.body = jwt.sign({
            account
        }, jwt_secret);
    else
        throw UNAUTHORIZED_EXCEPTION.new();
})

.delete('/', ctx => ctx.status = 200);
