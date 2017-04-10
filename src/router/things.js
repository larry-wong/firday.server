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
const pool = require('../pool');
const { PARAM_EXCRPTION, NOT_FOUND_EXCEPTION } = require('../exceptions');

module.exports = new Router()

.get('/', async ctx => {
    ctx.body.forEach(thing => thing.state = pool.getState(thing.id));

}).post('/', async ctx => {
    await pool.createConnection(ctx.body);
    ctx.body.state = pool.getState(ctx.body.id);

}).patch('/:id', async ctx => {
    await pool.descroyConnection(ctx.params.id);
    await pool.createConnection(ctx.body);

}).delete('/:id', async ctx => {
    await pool.descroyConnection(ctx.params.id);

}).get('/:id/state', async ctx => {
    const state = pool.getState(ctx.params.id);
    if (state === undefined) throw NOT_FOUND_EXCEPTION.new();
    else ctx.body = state;

}).post('/:id/state', async ctx => {
    if (await pool.setState(ctx.params.id, ctx.request.body))
        ctx.body = ctx.request.body;
    else
        throw PARAM_EXCRPTION.new('Set state failed');
});
