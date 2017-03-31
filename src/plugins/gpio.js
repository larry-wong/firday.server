/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-28 22:08
#
# Description:	
#
=============================================================================*/

'use strict';

module.exports = {

    params: [{
        name: 'port',
        required: true,
        checker: () => true
    }],

    create: async params => {
        console.log('Create gpio plugin', params);
    },

    destroy: async params => {
        console.log('Desctoy gpio plugin', params);
    },

    getState: async params => {
        console.log('getState is called', params);
    },

    setState: async (params, state) => {
        console.log('setState is called', params, state);
    }
};
