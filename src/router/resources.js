/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-12 18:18
#
# Description:	
#
=============================================================================*/

'use strict';

const Router = require('koa-router');
const resources = require('../resources');
const db = require('../database');
const { PARAM_EXCRPTION, NOT_FOUND_ECXEPTION } = require('../exceptions');

const resolveBodyData = (ctx, defaultData, allowedFields) => {
    const ret = Object.assign({}, defaultData);
    const requestData = ctx.request.body;
    for (const key in requestData) {
        if (key === 'id' || !(key in allowedFields)) {
            throw PARAM_EXCRPTION.new();
        } else {
            ret[key] = requestData[key];
        }
    }
    return ret;
};

module.exports = Object.entries(resources).reduce((prev, [name, resource]) => {
    const router = new Router();

    resource.allowGet && router.get('/', async ctx => {
        const [docs] = await db[name].find({}, { _id: 0 });
        ctx.body = docs;
    });

    resource.allowPost && router.post('/', async (ctx, next) => {
        ctx.data = resolveBodyData(ctx, resource.fields, resource.fields);

        await next();

        if ('id' in resource.fields) {
            const [ , affectedDocuments]
                = await db[name].getAutoIncrementId();
            ctx.data.id = affectedDocuments.id;
        }
        const [newDoc] = await db[name].insert(ctx.data);
        delete newDoc._id;
        ctx.body = newDoc;
    });

    resource.allowPatch && router.patch('/:id', async (ctx, next) => {
        ctx.data = resolveBodyData(ctx, {}, resource.fields);

        await next();

        const [numAffected, affectedDocuments] = await db[name].update({
            id: ~~ctx.params.id
        }, { $set: ctx.data }, {
            returnUpdatedDocs: true
        });
        if (!numAffected) throw NOT_FOUND_ECXEPTION.new();
        delete affectedDocuments._id;
        ctx.body = affectedDocuments;
    });

    resource.allowDelete && router.delete('/:id', async ctx => {
        const [numRemoved] = await db[name].remove({
            id: ~~ctx.params.id
        }, {});
        if (!numRemoved) throw NOT_FOUND_ECXEPTION.new();
        ctx.status = 200;
    });

    prev[name] = router;
    return prev;
}, {});
