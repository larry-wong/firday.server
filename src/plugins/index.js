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

module.exports = ['gpio', 'mqtt'].reduce((prev, name) => {
    prev[name] = require(`./${name}`);
    return prev;
}, {});
