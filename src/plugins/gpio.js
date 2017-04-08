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

const gpio = require('rpi-gpio');

// Override gpio methods by Promise
['setup', 'read', 'write', 'destroy'].forEach(method => {
    const superMethod = gpio[method];
    gpio[method] = function() {
        return new Promise((resolve, reject) =>
            superMethod.call(gpio, ...arguments, function(err, readValue) {
                if (err) reject(err);
                else resolve(readValue && 1 || 0);
            })
        );
    };
});

module.exports = {

    params: [{
        name: 'pin',
        required: true,
        checker: () => true
    }],

    create: params => gpio.setup(params.pin),

    destroy: async params => {
        console.log('Desctoy gpio plugin', params);
    },

    getState: params => gpio.read(params.pin),

    setState: (params, state) => gpio.write(params.pin, state)
};
