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

const { PARAM_EXCRPTION, NOT_FOUND_ECXEPTION, DB_EXCEPTION }
    = require('./exceptions');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        switch (e.name) {
        case PARAM_EXCRPTION:
            ctx.status = 400;
            break;
        case NOT_FOUND_ECXEPTION:
            ctx.status = 404;
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
