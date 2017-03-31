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
const subRouters = ['types'].reduce((prev, name) => {
    prev[name] = require(`./${name}`);
    return prev;
}, require('./resources'));
const thingsRouter = require('./things');

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

// The rests
Object.entries(subRouters).forEach(([name, subRouter]) =>
    router.use(`/${name}`, subRouter.routes(), subRouter.allowedMethods())
);

// Things are special
router.use('/things', thingsRouter.routes(), thingsRouter.allowedMethods());

module.exports = router;
