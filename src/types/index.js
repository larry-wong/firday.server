/*=============================================================================
#
# Copyright (C) 2017 All rights reserved.
#
# Author:	Larry Wang
#
# Created:	2017-03-25 21:18
#
# Description:	
#
=============================================================================*/

'use strict';

module.exports = ['button', 'switch', 'slider'].reduce((prev, name) => {
    const type = require(`./${name}`);
    const id = type.id;
    delete type.id;
    prev[id] = Object.assign(type, { name });
    return prev;
}, {});
