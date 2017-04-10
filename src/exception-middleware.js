/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-26 14:20
#
# Description:	
#
=============================================================================*/

'use strict';

const { PARAM_EXCRPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION
    , FORBIDDEN_EXCEPTION, DB_EXCEPTION }
    = require('./exceptions');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        switch (e.name) {
        case PARAM_EXCRPTION:
            ctx.status = 400;
            break;
        case NOT_FOUND_EXCEPTION:
            ctx.status = 404;
            break;
        case UNAUTHORIZED_EXCEPTION:
            ctx.status = 401;
            break;
        case FORBIDDEN_EXCEPTION:
            ctx.status = 403;
            break;
        case DB_EXCEPTION:
            ctx.status = 500;
            break;
        default:
            ctx.status = 500;
            break;
        }
        e.message && console.error(`Error: ${e.message}`);
    }
};
