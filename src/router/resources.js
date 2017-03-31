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

const checkBodyData = (data, fields) => {
    for (const key in data) {
        if (!Reflect.has(fields, key))
            throw PARAM_EXCRPTION.new(`Invalid param: ${key}`);
        const { autoIncrement, checker } = fields[key];
        if (autoIncrement)
            throw PARAM_EXCRPTION.new(`${key} is auto increased`);
        if (checker && !checker(data[key]))
            throw PARAM_EXCRPTION.new(`${key} check failed`);
    }
};

module.exports = Object.entries(resources).reduce((prev, [name, resource]) => {
    const router = new Router();

    const projections = Object.keys(resource.fields).reduce((prev, key) => {
        prev[key] = 1;
        return prev;
    }, { _id: 0 });

    resource.allowGet && router.get('/', async (ctx, next) => {
        [ctx.data] = await db[name].find({}, projections);
        ctx.body = ctx.data.sort((a, b) => a.id - b.id);

        await next();
    });

    resource.allowPost && router.post('/', async (ctx, next) => {
        checkBodyData(ctx.request.body, resource.fields);

        Object.entries(resource.fields).forEach(([field, { required }]) => {
            if (required && !Reflect.has(ctx.request.body, field))
                throw PARAM_EXCRPTION.new(`Miss param: ${field}`);
        });

        for (const key in resource.fields) {
            if (resource.fields[key].autoIncrement)
                ctx.request.body[key] = await db[name].getAutoIncrement(key);
        }

        const [newDoc] = await db[name].insert(ctx.request.body);
        Reflect.deleteProperty(newDoc, '_id');
        ctx.body = newDoc;

        await next();
    });

    resource.allowPatch && router.patch('/:id', async (ctx, next) => {
        checkBodyData(ctx.request.body, resource.fields);

        const [numAffected, affectedDocuments] = await db[name].update({
            id: ~~ctx.params.id
        }, { $set: ctx.request.body }, {
            returnUpdatedDocs: true
        });
        if (!numAffected) throw NOT_FOUND_ECXEPTION.new();
        Reflect.deleteProperty(affectedDocuments, '_id');
        ctx.body = affectedDocuments;

        await next();
    });

    resource.allowDelete && router.delete('/:id', async (ctx, next) => {
        const [numRemoved] = await db[name].remove({
            id: ~~ctx.params.id
        }, {});
        if (!numRemoved) throw NOT_FOUND_ECXEPTION.new();
        ctx.status = 200;

        await next();
    });

    prev[name] = router;
    return prev;
}, {});
