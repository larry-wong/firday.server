/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-12 17:29
#
# Description:	
#
=============================================================================*/

'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const exctptionMiddleware = require('./exception-middleware');
const router = require('./router');

const app = new Koa();

app.use(exctptionMiddleware);

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
