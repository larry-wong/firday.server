/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-25 21:42
#
# Description:	
#
=============================================================================*/

'use strict';

const Router = require('koa-router');
const types = require('../types');

module.exports = new Router().get('/', ctx=> {
    ctx.body = Object.entries(types).map(([id, type]) => ({
        id,
        name: type.name
    }));
});
