/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-12 17:51
#
# Description:	
#
=============================================================================*/

'use strict';

const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const subRouters = ['types', 'token'].reduce((prev, name) => {
    prev[name] = require(`./${name}`);
    return prev;
}, require('./resources'));
const thingsRouter = require('./things');
const { jwt_secret } = require('../config');
const { UNAUTHORIZED_EXCEPTION, FORBIDDEN_EXCEPTION } = require('../exceptions');

const router = new Router({
    prefix: '/api'
});

// Show all restful apis as JSON
router.get('/', ctx => {
    const ret = Object.keys(subRouters).map(key =>
        `  "${key}": "${ctx.origin}${ctx.path}/${key}"`
    );
    ctx.body = `{\n${ret.join(',\n')}\n}`;
});

// To auth token
const authMiddleware = async (ctx, next) => {
    if (ctx.header.token === undefined) throw FORBIDDEN_EXCEPTION.new();
    try {
        Object.assign(ctx, jwt.verify(ctx.header.token.toString(), jwt_secret));
    } catch (err) {
        throw UNAUTHORIZED_EXCEPTION.new();
    }
    await next();
};

// The rests
Object.entries(subRouters).forEach(([name, subRouter]) => {
    if (name === 'token')
        router.use(`/${name}`, subRouter.routes(), subRouter.allowedMethods());
    else
        router.use(`/${name}`, authMiddleware
            , subRouter.routes(), subRouter.allowedMethods());
});

// Things are special
router.use('/things', thingsRouter.routes(), thingsRouter.allowedMethods());

module.exports = router;
