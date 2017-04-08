/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-28 22:35
#
# Description:	
#
=============================================================================*/

'use strict';

const types = require('./types');
const plugins = require('./plugins');

// Sstore for current states
const store = new Map();

module.exports = {

    createConnection: async thing => {
        thing.id = ~~thing.id;

        // If connection already created, ignore it.
        if (store.has(thing.id)) return;

        const type = types[thing.type];

        const { name: pluginName, params: pluginParams } = thing.plugin;
        const plugin = plugins[pluginName];

        await plugin.create(pluginParams);

        // Try to get state after creation
        let state = await plugin.getState(pluginParams);
        state = type.checkState(state) ? state : undefined;

        // Save this connections
        store.set(thing.id, {
            type,
            plugin,
            pluginParams,
            state
        });
    },

    descroyConnection: async id => {
        id = ~~id;

        if (!store.has(id)) return;

        const { plugin, pluginParams } = store.get(id);

        await plugin.destroy(pluginParams);

        store.delete(id);
    },

    getState: id => {
        id = ~~id;
        return (store.get(id) || {}).state;
    },

    setState: async (id, state) => {
        id = ~~id;

        if (!store.has(id)) return false;

        const { type, plugin, pluginParams, state: currentState } = store.get(id);

        if (type.checkState && !type.checkState(state))
            return false;
        if (state !== currentState) {
            plugin.setState(pluginParams, state);
            store.get(id).state = state;
        }
        return true;
    }
};
