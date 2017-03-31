/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-16 22:39
#
# Description:	
#
=============================================================================*/

'use strict';

const types = require('../types');
const plugins = require('../plugins');

module.exports = {

    allowGet: true,
    allowPost: true,
    allowPatch: true,
    allowDelete: true,

    fields: {
        id: {
            autoIncrement: true
        },
        name: {},
        type: {
            required: true,
            checker: value => Reflect.has(types, value)
        },
        plugin: {
            required: true,
            checker: value => {
                if (!value) return false;
                let { name, params } = value;
                params = Object.assign({}, params);
                if (!Reflect.has(plugins, name)) return false;
                const { params: paramsConfig } = plugins[name] || {};
                for (const i in paramsConfig) {
                    const config = paramsConfig[i];
                    if (config.required && !Reflect.has(params, config.name))
                        return false;
                    if (config.checker && !config.checker(params[config.name]))
                        return false;
                    Reflect.deleteProperty(params, config.name);
                }
                return !Object.keys(params).length;
            }
        }
    }
};
