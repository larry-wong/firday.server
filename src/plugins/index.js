/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-28 22:48
#
# Description:	
#
=============================================================================*/

'use strict';

const noop = new Function();

const defaultPlugin = {
    params: [],
    create: noop,
    destroy: noop,
    getState: noop,
    setState: noop
};

module.exports = ['gpio', 'mqtt'].reduce((prev, name) => {
    prev[name] = Object.assign({}, defaultPlugin, require(`./${name}`));
    return prev;
}, {});
