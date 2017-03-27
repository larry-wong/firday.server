/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-26 20:49
#
# Description:	
#
=============================================================================*/

'use strict';

const Router = require('koa-router');
const { things } = require('../database');
const types = require('../types');
const { PARAM_EXCRPTION, NOT_FOUND_ECXEPTION } = require('../exceptions');

const middleware = async ctx => {
    if (!('state' in ctx.data)) return;
    let typeId;
    if ('type_id' in ctx.data) {
        typeId = ctx.data.type_id;
    } else {
        const [doc] = await things.findOne({
            id: ~~ctx.params.id
        });
        if (!doc) throw NOT_FOUND_ECXEPTION.new();
        typeId = doc.type_id;
    }
    if (!(typeId in types) || !types[typeId].checkState(ctx.data.state))
        throw PARAM_EXCRPTION.new();
};

module.exports = new Router().post('/', middleware).patch('/:id', middleware);
