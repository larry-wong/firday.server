/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-21 22:12
#
# Description:	
#
=============================================================================*/

'use strict';

const DataStore = require('nedb');
const resources = require('./resources');
const { DB_EXCEPTION } = require('./exceptions');

const dbPath = 'database/';
const autocompactionInterval = 3600 * 1e3;

// Override db methods by Promise
['insert', 'find', 'findOne', 'update', 'remove'].forEach(method => {
    const superMethod = DataStore.prototype[method];
    DataStore.prototype[method] = function() {
        return new Promise((resolve, reject) =>
            superMethod.call(this, ...arguments, function() {
                const [err, ...args] = arguments;
                if (err) reject(DB_EXCEPTION.new(err.message));
                else resolve([...args]);
            })
        );
    };
});

// A db factory
const createDb = name => {
    const db = new DataStore({
        filename: `${dbPath}${name}.db`,
        autoload: true
    });

    db.persistence.setAutocompactionInterval(autocompactionInterval);

    return db;
};

// Create a db for auto increment ids: {name: 'things', id: 0}
const autoIncrementDB = createDb('autoIncrements');
autoIncrementDB.ensureIndex({
    fieldName: 'name',
    unique: 'true'
});

// Create dbs for resources
module.exports = Object.entries(resources).reduce((prev, [name, resource]) => {
    const db = createDb(name);

    Object.entries(resource.fields).forEach(([field, { autoIncrement }]) => {
        autoIncrement && db.ensureIndex({
            fieldName: field,
            unique: true
        });
    });

    db.getAutoIncrement = field => autoIncrementDB.update({
        name
    }, {
        $inc: { [`autoIncrements.${field}`]: 1 }
    }, {
        upsert: true,
        returnUpdatedDocs: true
    }).then(([ , affectedDocuments]) => affectedDocuments.autoIncrements[field]);

    prev[name] = db;

    return prev;
}, {});
